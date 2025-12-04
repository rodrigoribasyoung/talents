import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { getJobs, updateJobStatus } from '../services/jobsService';
import { Plus, MapPin, Briefcase, Calendar, MoreVertical, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await getJobs();
    setJobs(data);
    setLoading(false);
  };

  const handleToggleStatus = async (job: Job) => {
    const newStatus = job.status === 'Aberta' ? 'Fechada' : 'Aberta';
    if (job.id) {
        await updateJobStatus(job.id, newStatus);
        loadJobs();
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(filter.toLowerCase()) ||
    j.city.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Vagas</h1>
          <p className="text-gray-500 text-sm">Gerencie as oportunidades abertas na Young.</p>
        </div>
        {/* Link para futura página de criação */}
        <button 
          className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-fit opacity-50 cursor-not-allowed"
          title="Funcionalidade em desenvolvimento"
        >
          <Plus size={18} />
          Nova Vaga
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Buscar vagas..." 
                className="pl-10 w-full outline-none text-sm text-gray-700"
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Carregando vagas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        job.status === 'Aberta' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {job.status}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded uppercase font-bold tracking-wider">
                        {job.type}
                    </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Briefcase size={14} />
                    {job.area}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    {job.city} - {job.state}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleToggleStatus(job)}
                        className="text-xs font-medium text-gray-600 hover:text-primary underline"
                    >
                        {job.status === 'Aberta' ? 'Fechar Vaga' : 'Reabrir'}
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;