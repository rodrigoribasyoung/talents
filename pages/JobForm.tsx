import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/jobsService';
import { Job } from '../types';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    area: '',
    city: '',
    state: '',
    type: 'CLT',
    status: 'Aberta',
    tags: [] // Inicializa array vazio
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createJob({
        ...formData,
        company: 'Young Empreendimentos',
        createdAt: new Date().toISOString(),
        createdBy: user?.email || 'sistema',
        tags: [] // Garante array
      } as any);
      
      navigate('/jobs');
    } catch (error) {
      alert('Erro ao criar vaga');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/jobs')} className="flex items-center text-gray-500 hover:text-primary mb-4 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Voltar para Vagas
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Nova Vaga</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título da Vaga</label>
              <input required name="title" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ex: Analista Financeiro" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <input required name="area" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ex: Obras" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
                <select name="type" onChange={handleChange} className="w-full p-2 border rounded-lg bg-white outline-none">
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="Estágio">Estágio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input required name="city" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <input required name="state" maxLength={2} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="RS" />
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea name="description" rows={4} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Save size={18} />
              {loading ? 'Salvando...' : 'Publicar Vaga'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobForm;