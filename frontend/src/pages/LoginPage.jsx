import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro no login.');

      login(data.user, data.token);
      const from = location.state?.from || '/minha-conta'; 
      navigate(from);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white dark:bg-gray-900">
      
      {/* 🖼️ Lado Esquerdo: Imagem de Luxo (ESTRUTURA INFALÍVEL) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-100 dark:bg-black overflow-hidden">
        
        {/* Imagem Principal */}
        <img 
          src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca418?q=80&w=1200&auto=format&fit=crop" 
          alt="Luxury Skincare" 
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        
        {/* Overlay Escuro para dar Contraste (Opacidade fixa) */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        {/* Texto de Boas-vindas */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-10">
          <h2 className="font-syne text-5xl font-bold mb-6 drop-shadow-2xl">Careful Baza</h2>
          <p className="text-xs uppercase tracking-[0.5em] font-bold opacity-80">
            A sua rotina exclusiva de alta performance
          </p>
        </div>
      </div>

      {/* 📝 Lado Direito: Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 md:px-20 lg:px-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full max-w-sm mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors mb-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t('auth.back_home')}
          </Link>

          <h1 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-2">Bem-vindo</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">Aceda à sua conta para gerir os seus rituais.</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border-l-2 border-red-500 p-4 mb-8">
              <p className="text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('auth.email_label')}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-0 py-3 text-sm text-gray-900 dark:text-white focus:border-baza-lavender dark:focus:border-baza-mint outline-none transition-all" placeholder="nome@email.com" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('auth.pass_label')}</label>
                <Link to="/recuperar-senha" className="text-[10px] font-bold uppercase tracking-widest text-baza-lavender dark:text-baza-mint hover:underline">{t('auth.forgot_pass')}</Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-0 py-3 text-sm text-gray-900 dark:text-white focus:border-baza-lavender dark:focus:border-baza-mint outline-none transition-all" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black dark:bg-white text-white dark:text-black py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all shadow-xl flex items-center justify-center disabled:opacity-50 mt-10">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : t('auth.login_btn')}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-400 text-xs">
              Ainda não faz parte do Labs? <Link to="/cadastro" className="font-bold text-gray-900 dark:text-white hover:text-baza-lavender transition-colors ml-1">{t('auth.register_btn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}