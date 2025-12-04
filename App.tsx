import React from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Pipeline from './pages/Pipeline';
import Dashboard from './pages/Dashboard';
import { LayoutDashboard, Users, LogOut, Kanban } from 'lucide-react';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center text-primary">Carregando...</div>;
  if (!user) return <LoginPage />;
  
  return <>{children}</>;
};

const LoginPage = () => {
    const { signIn } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-primary w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">Young Talents ATS</h1>
                <p className="text-gray-500 mb-8">Acesso restrito a gestores e administradores.</p>
                <button 
                    onClick={() => signIn()}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4 bg-white rounded-full" alt="Google" />
                    Entrar com Google
                </button>
            </div>
        </div>
    )
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, signOut } = useAuth();
    const location = useLocation();

    // Função auxiliar para estilizar o link ativo
    const isActive = (path: string) => location.pathname === path 
        ? 'text-primary bg-orange-50 border-primary/20 shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50 border-transparent';

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-400 rounded-lg flex items-center justify-center text-white font-bold font-display">
                                Y
                            </div>
                            <span className="font-display font-bold text-lg text-gray-900 tracking-tight hidden md:block">Young Talents</span>
                        </div>

                        {/* Menu de Navegação */}
                        <nav className="hidden md:flex items-center gap-2">
                            <Link 
                                to="/dashboard" 
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isActive('/dashboard')}`}
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                            <Link 
                                to="/" 
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isActive('/')}`}
                            >
                                <Kanban size={18} />
                                Pipeline
                            </Link>
                        </nav>
                    </div>
                    
                    {/* Perfil do Usuário */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pr-4 border-r border-gray-200">
                             <img src={user?.photoURL} alt={user?.name} className="w-8 h-8 rounded-full bg-gray-200" />
                             <div className="hidden md:block text-sm">
                                <p className="font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                             </div>
                        </div>
                        <button 
                            onClick={signOut}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sair"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <Routes>
                {/* Rota da Dashboard */}
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </PrivateRoute>
                } />
                
                {/* Rota da Pipeline (Raiz) */}
                <Route path="/" element={
                    <PrivateRoute>
                        <Layout>
                            <Pipeline />
                        </Layout>
                    </PrivateRoute>
                } />

                {/* Redirecionamento Padrão */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;