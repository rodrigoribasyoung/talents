import React, { useState, useEffect } from 'react';
import { Candidate, STAGES, PipelineStage } from '../types';
import { X, ExternalLink, Calendar, MapPin, Mail, Phone, AlertCircle, CheckCircle, Trash2, Clock, ShieldAlert } from 'lucide-react';
import { normalizeCity, formatDate } from '../utils/normalizers';
import { updateCandidate, deleteCandidate } from '../services/mockFirebase';
import { useAuth } from '../context/AuthContext';

interface SlideOverProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Candidate) => void;
  onDelete: (id: string) => void;
}

const CandidateSlideOver: React.FC<SlideOverProps> = ({ candidate, isOpen, onClose, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'process' | 'history'>('details');
  const [formData, setFormData] = useState<Partial<Candidate>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (candidate) {
      setFormData(candidate);
      setValidationError(null);
    }
  }, [candidate]);

  if (!candidate || !isOpen) return null;

  const handleInputChange = (field: keyof Candidate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateMove = (targetStage: PipelineStage): { valid: boolean; error?: string } => {
    if (!formData) return { valid: false };

    // Gate 1: Inscrito -> Considerado
    if (targetStage === 'Considerado') {
      if (!formData.city || formData.city.trim() === '') return { valid: false, error: 'Cidade é obrigatória para mover para Considerado.' };
      if (formData.hasDriverLicense === undefined) return { valid: false, error: 'Informação de CNH é obrigatória.' };
    }

    // Gate 2: -> Selecionado
    if (targetStage === 'Selecionado') {
      if (!formData.interviewNotes) return { valid: false, error: 'Preencha as anotações da entrevista antes de selecionar.' };
      if (!formData.managerFeedback) return { valid: false, error: 'Feedback do gestor é obrigatório.' };
      if (!formData.feedbackGiven) return { valid: false, error: 'Você deve confirmar que o feedback foi dado ao candidato.' };
    }

    return { valid: true };
  };

  const handleStageChange = async (newStage: PipelineStage) => {
    const validation = validateMove(newStage);
    if (!validation.valid) {
      setValidationError(validation.error || 'Erro de validação');
      return;
    }

    try {
      const updatedHistory = [
        {
          date: new Date().toISOString(),
          action: `Mudança de estágio: ${candidate.pipelineStage} -> ${newStage}`,
          user: user?.email || 'Unknown'
        },
        ...(formData.history || [])
      ];

      const toSave = { ...candidate, ...formData, pipelineStage: newStage, history: updatedHistory } as Candidate;
      const saved = await updateCandidate(toSave, user?.email || 'Unknown');
      onUpdate(saved);
      setValidationError(null);
      alert(`Candidato movido para ${newStage}`);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar");
    }
  };

  const handleSave = async () => {
    try {
      const toSave = { ...candidate, ...formData } as Candidate;
      const saved = await updateCandidate(toSave, user?.email || 'Unknown');
      onUpdate(saved);
      alert("Dados atualizados com sucesso!");
    } catch (err) {
      alert("Erro ao salvar dados.");
    }
  };

  const handleDelete = async () => {
    if(window.confirm("Tem certeza que deseja excluir permanentemente este candidato? Esta ação não pode ser desfeita.")) {
        await deleteCandidate(candidate.legacyId);
        onDelete(candidate.legacyId);
        onClose();
    }
  }

  // File Link Helper Component
  const FileLinkHelper = ({ url, label }: { url?: string, label: string }) => {
    if (!url) return <span className="text-gray-400 text-sm italic">Não anexado</span>;
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
      >
        <span>📄</span>
        <span className="truncate max-w-[150px]">{label}</span>
        <ExternalLink size={12} />
      </a>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900">{formData.fullName}</h2>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Alerts / LGPD */}
        {formData.optOutLGPD && (
          <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex items-center gap-2 text-red-700 text-sm">
            <ShieldAlert size={16} />
            <span className="font-semibold">DNC (Do Not Contact):</span> Candidato solicitou opt-out LGPD.
            {user?.role === 'admin' && (
                <button 
                    onClick={handleDelete}
                    className="ml-auto text-xs underline text-red-800 hover:text-red-900"
                >
                    Excluir Dados
                </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button 
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Dados & Currículo
          </button>
          <button 
            onClick={() => setActiveTab('process')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'process' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Processo & Feedback
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Histórico
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Informações Básicas</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Telefone</label>
                    <div className="flex items-center gap-2 text-sm text-gray-800">
                        <Phone size={14} className="text-primary"/>
                        {formData.phone}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Idade</label>
                    <div className="text-sm text-gray-800">{formData.age} anos ({formatDate(formData.birthDate || '')})</div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500">Localização</label>
                    <div className="flex items-center gap-2 text-sm text-gray-800">
                        <MapPin size={14} className="text-primary"/>
                        <input 
                            className="border-b border-gray-300 focus:border-primary outline-none bg-transparent w-full"
                            value={formData.city || ''}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Cidade"
                        />
                        <span className="text-gray-400">/ {formData.state}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Qualificações</h3>
                <div>
                   <label className="text-xs text-gray-500">Formação</label>
                   <p className="text-sm font-medium">{formData.educationLevel}</p>
                   <p className="text-xs text-gray-600">{formData.educationBackground} - {formData.institution}</p>
                </div>
                <div>
                    <label className="text-xs text-gray-500">Carteira de Habilitação</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input 
                            type="checkbox"
                            checked={formData.hasDriverLicense || false}
                            onChange={(e) => handleInputChange('hasDriverLicense', e.target.checked)}
                            className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Possui CNH</span>
                    </div>
                </div>
                 <div>
                    <label className="text-xs text-gray-500 mb-1 block">Áreas de Interesse</label>
                    <div className="flex flex-wrap gap-2">
                        {formData.interestAreas?.map((area, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{area}</span>
                        ))}
                    </div>
                </div>
              </div>

               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                 <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Anexos</h3>
                 <div className="flex gap-4">
                    <FileLinkHelper url={formData.resumeUrl} label="Abrir Currículo" />
                    <FileLinkHelper url={formData.portfolioUrl} label="Abrir Portfólio" />
                 </div>
               </div>
               
               <div className="flex justify-end pt-4">
                  <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-600 text-sm font-medium transition-colors">
                      Salvar Alterações
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-6">
                 {/* Stage Control */}
                 <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Mover no Pipeline</h3>
                    
                    {validationError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            {validationError}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        {STAGES.map((stage) => (
                            <button
                                key={stage}
                                onClick={() => handleStageChange(stage)}
                                disabled={stage === formData.pipelineStage}
                                className={`
                                    text-xs py-2 px-3 rounded border transition-all text-left
                                    ${stage === formData.pipelineStage 
                                        ? 'bg-secondary text-white border-secondary font-bold ring-2 ring-offset-1 ring-secondary' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                                    }
                                `}
                            >
                                {stage}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Feedback Section */}
                 <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Avaliação & Feedback</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-700">Anotações da Entrevista</label>
                            <textarea 
                                className="w-full mt-1 p-2 border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                rows={4}
                                placeholder="Pontos fortes, fracos, fit cultural..."
                                value={formData.interviewNotes || ''}
                                onChange={(e) => handleInputChange('interviewNotes', e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-medium text-gray-700">Parecer do Gestor</label>
                            <textarea 
                                className="w-full mt-1 p-2 border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                rows={3}
                                placeholder="Aprovado tecnicamente? Observações finais."
                                value={formData.managerFeedback || ''}
                                onChange={(e) => handleInputChange('managerFeedback', e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                             <input 
                                type="checkbox"
                                id="feedbackGiven"
                                checked={formData.feedbackGiven || false}
                                onChange={(e) => handleInputChange('feedbackGiven', e.target.checked)}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                             />
                             <label htmlFor="feedbackGiven" className="text-sm text-gray-700 font-medium select-none cursor-pointer">
                                Feedback final comunicado ao candidato?
                             </label>
                        </div>
                    </div>
                     <div className="flex justify-end pt-4">
                        <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-600 text-sm font-medium transition-colors">
                            Salvar Feedback
                        </button>
                    </div>
                 </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                    {formData.history?.map((entry, idx) => (
                        <div key={idx} className="ml-6 relative">
                            <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-gray-200">
                                <Clock size={12} className="text-gray-500" />
                            </span>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                                <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(entry.date).toLocaleString('pt-BR')}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Por: {entry.user}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateSlideOver;