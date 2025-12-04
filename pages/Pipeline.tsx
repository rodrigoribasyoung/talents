import React, { useState, useEffect, useMemo } from 'react';
import { Candidate, STAGES, PipelineStage } from '../types';
import { getCandidates, updateCandidate } from '../services/candidateService';
import CandidateSlideOver from '../components/CandidateSlideOver';
import { Search, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { normalizeCity } from '../utils/normalizers';

const Pipeline: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCandidate = (updated: Candidate) => {
    setCandidates(prev => prev.map(c => c.legacyId === updated.legacyId ? updated : c));
    setSelectedCandidate(updated); // Keep slideover in sync
  };

  const handleDeleteCandidate = (id: string) => {
      setCandidates(prev => prev.filter(c => c.legacyId !== id));
  }

  // Group candidates by stage
  const columns = useMemo(() => {
    const grouped: Record<string, Candidate[]> = {};
    STAGES.forEach(stage => { grouped[stage] = []; });
    
    candidates.forEach(candidate => {
        // Filter logic here
        const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (matchesSearch && grouped[candidate.pipelineStage]) {
            grouped[candidate.pipelineStage].push(candidate);
        }
    });
    return grouped;
  }, [candidates, searchTerm]);

  // Alert Logic for Card
  const hasPendingAction = (c: Candidate): boolean => {
      // Logic: If in 'Selecionado' and feedbackGiven is false
      if (c.pipelineStage === 'Selecionado' && !c.feedbackGiven) return true;
      // Logic: If in 'Inscrito' for more than 7 days (mock logic)
      const daysSinceCreated = (new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 3600 * 24);
      if (c.pipelineStage === 'Inscrito' && daysSinceCreated > 7) return true;
      
      return false;
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Toolbar */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold font-display text-gray-900">Pipeline de Talentos</h1>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                {candidates.length} candidatos
            </span>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por nome ou email..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Filter size={18} />
                Filtros
            </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex h-full gap-4 min-w-[1200px]">
          {STAGES.map((stage) => (
            <div key={stage} className="flex-1 flex flex-col min-w-[280px] max-w-[350px] bg-gray-100/50 rounded-xl border border-gray-200/60">
                {/* Column Header */}
                <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white/50 rounded-t-xl backdrop-blur-sm sticky top-0">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stage === 'Selecionado' ? 'bg-green-500' : 'bg-secondary'}`} />
                        <h3 className="font-semibold text-gray-700 text-sm">{stage}</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100">
                        {columns[stage].length}
                    </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                    {columns[stage].map((candidate) => {
                        const isAlert = hasPendingAction(candidate);
                        return (
                            <div 
                                key={candidate.legacyId}
                                onClick={() => setSelectedCandidate(candidate)}
                                className={`
                                    bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-all
                                    ${isAlert ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 hover:border-primary/50'}
                                    ${candidate.optOutLGPD ? 'opacity-60 bg-gray-50' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 text-sm truncate pr-2">{candidate.fullName}</h4>
                                    {isAlert && <AlertTriangle size={14} className="text-red-500 shrink-0 animate-pulse" />}
                                    {candidate.pipelineStage === 'Selecionado' && candidate.feedbackGiven && (
                                        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                                    )}
                                </div>
                                
                                <p className="text-xs text-gray-500 mb-2 truncate">{normalizeCity(candidate.city)}</p>
                                
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {candidate.interestAreas.slice(0, 2).map((area, i) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase tracking-wide">
                                            {area}
                                        </span>
                                    ))}
                                    {candidate.interestAreas.length > 2 && (
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[10px] rounded">+{candidate.interestAreas.length - 2}</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(candidate.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                    {candidate.hasDriverLicense && (
                                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1 rounded">CNH</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          ))}
        </div>
      </div>

      <CandidateSlideOver 
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onUpdate={handleUpdateCandidate}
        onDelete={handleDeleteCandidate}
      />
    </div>
  );
};

export default Pipeline;