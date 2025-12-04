import React, { useState, useEffect, useMemo } from 'react';
import { getCandidates } from '../services/mockFirebase'; // Ou seu serviço Firebase real
import { Candidate } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, UserCheck, UserX, Calendar, Clock, Briefcase } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#fe5009', '#00bcbc'];

const Dashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega dados (substitua pela chamada real se necessário)
    getCandidates().then(data => {
      setCandidates(data);
      setLoading(false);
    });
  }, []);

  // --- Cálculos de KPIs ---
  const kpis = useMemo(() => {
    const total = candidates.length;
    const hired = candidates.filter(c => c.status === 'Contratado' || c.pipelineStage === 'Selecionado').length;
    const rejected = candidates.filter(c => c.status === 'Reprovado').length;
    const interviews = candidates.filter(c => ['Entrevista I', 'Entrevista II'].includes(c.pipelineStage)).length;
    
    // Taxa de conversão (exemplo simples: contratados / total)
    const conversionRate = total > 0 ? ((hired / total) * 100).toFixed(1) : '0';

    return { total, hired, rejected, interviews, conversionRate };
  }, [candidates]);

  // --- Dados para Gráficos ---
  
  // 1. Candidatos por Etapa (Funil)
  const funnelData = useMemo(() => {
    const stagesCount: Record<string, number> = {};
    candidates.forEach(c => {
      stagesCount[c.pipelineStage] = (stagesCount[c.pipelineStage] || 0) + 1;
    });
    return Object.keys(stagesCount).map(stage => ({
      name: stage,
      count: stagesCount[stage]
    }));
  }, [candidates]);

  // 2. Origem dos Candidatos
  const originData = useMemo(() => {
    const originCount: Record<string, number> = {};
    candidates.forEach(c => {
      const origin = c.sourceOrigin || 'Desconhecido';
      originCount[origin] = (originCount[origin] || 0) + 1;
    });
    return Object.keys(originCount).map(origin => ({
      name: origin,
      value: originCount[origin]
    }));
  }, [candidates]);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando Dashboard...</div>;

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      <h1 className="text-2xl font-bold font-display text-gray-900 mb-6">Dashboard Gerencial</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total de Candidatos" value={kpis.total} icon={Users} color="bg-blue-50 text-blue-600" />
        <KPICard title="Contratados" value={kpis.hired} icon={UserCheck} color="bg-green-50 text-green-600" />
        <KPICard title="Entrevistas Ativas" value={kpis.interviews} icon={Calendar} color="bg-purple-50 text-purple-600" />
        <KPICard title="Taxa de Conversão" value={`${kpis.conversionRate}%`} icon={Briefcase} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Barras - Pipeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Candidatos por Etapa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                <YAxis />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#fe5009" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Origem */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Origem dos Candidatos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={originData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {originData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
      {/* Lista de Recentes */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4">Últimos Inscritos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Nome</th>
                <th className="px-4 py-3">Vaga/Interesse</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.slice(0, 5).map(c => (
                <tr key={c.legacyId} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.fullName}</td>
                  <td className="px-4 py-3 text-gray-500">{c.interestAreas[0] || 'Geral'}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                      {c.pipelineStage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para os Cards
const KPICard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

export default Dashboard;