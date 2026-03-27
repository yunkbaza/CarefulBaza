import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);
    setResendMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification) setNeedsVerification(true);
        throw new Error(data.error || 'Login error.');
      }

      login(data.user, data.token);
      const from = location.state?.from || '/minha-conta'; 
      navigate(from);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResendMessage('Verification link resent!');
    } catch (err) {
      setResendMessage(err.message || 'Error resending link.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* 🖼️ Lado Esquerdo: Imagem (ESTRUTURA CORRIGIDA) */}
      {/* Usamos lg:block e relative para garantir que as camadas internas se posicionem corretamente */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden bg-zinc-200 dark:bg-black border-r border-gray-100 dark:border-gray-800">
        
        {/* Camada 0: A Imagem de fundo (Forçada com absolute inset-0) */}
        <img 
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop" 
          alt="Clean Beauty Ritual" 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
        />
        
        {/* Camada 1: Overlay escuro para legibilidade do texto (Z-10) */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Camada 2: Conteúdo de texto centralizado (Z-20) */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-12">
          <h2 className="font-syne text-5xl font-bold mb-4 drop-shadow-2xl">Careful Baza Labs</h2>
          <p className="text-sm uppercase tracking-[0.4em] font-bold opacity-90 drop-shadow-md">
            High Performance Skincare
          </p>
        </div>
      </div>

      {/* 📝 Lado Direito: Formulário de Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 md:px-20 lg:px-32 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors mb-12">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t('auth.back_home')}
          </Link>

          <h1 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.login_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Login to access your orders and rituals.</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">{t('auth.email_label')}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="you@email.com" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300">{t('auth.pass_label')}</label>
                <Link to="/recuperar-senha" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-mint transition-colors">{t('auth.forgot_pass')}</Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors shadow-lg flex items-center justify-center disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div> : t('auth.login_btn')}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('auth.no_account')} <Link to="/cadastro" className="font-bold text-gray-900 dark:text-white hover:text-baza-lavender transition-colors">{t('auth.register_btn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);
    setResendMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification) setNeedsVerification(true);
        throw new Error(data.error || 'Login error.');
      }

      login(data.user, data.token);
      const from = location.state?.from || '/minha-conta'; 
      navigate(from);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResendMessage('Verification link resent!');
    } catch (err) {
      setResendMessage(err.message || 'Error resending link.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* 🖼️ Lado Esquerdo: Imagem (ESTRUTURA CORRIGIDA) */}
      {/* Usamos lg:block e relative para garantir que as camadas internas se posicionem corretamente */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden bg-zinc-200 dark:bg-black border-r border-gray-100 dark:border-gray-800">
        
        {/* Camada 0: A Imagem de fundo (Forçada com absolute inset-0) */}
        <img 
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop" 
          alt="Clean Beauty Ritual" 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
        />
        
        {/* Camada 1: Overlay escuro para legibilidade do texto (Z-10) */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Camada 2: Conteúdo de texto centralizado (Z-20) */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-12">
          <h2 className="font-syne text-5xl font-bold mb-4 drop-shadow-2xl">Careful Baza Labs</h2>
          <p className="text-sm uppercase tracking-[0.4em] font-bold opacity-90 drop-shadow-md">
            High Performance Skincare
          </p>
        </div>
      </div>

      {/* 📝 Lado Direito: Formulário de Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 md:px-20 lg:px-32 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors mb-12">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t('auth.back_home')}
          </Link>

          <h1 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.login_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Login to access your orders and rituals.</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">{t('auth.email_label')}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="you@email.com" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300">{t('auth.pass_label')}</label>
                <Link to="/recuperar-senha" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-mint transition-colors">{t('auth.forgot_pass')}</Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors shadow-lg flex items-center justify-center disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div> : t('auth.login_btn')}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('auth.no_account')} <Link to="/cadastro" className="font-bold text-gray-900 dark:text-white hover:text-baza-lavender transition-colors">{t('auth.register_btn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}