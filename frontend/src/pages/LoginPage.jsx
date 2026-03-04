import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // Importação do tradutor

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation(); // Inicialização

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
      navigate('/minha-conta');
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
      {/* Lado Esquerdo: Imagem com Texto de Luxo */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 dark:bg-black relative items-center justify-center overflow-hidden border-r border-gray-100 dark:border-gray-800">
        <div className="absolute inset-0 bg-gray-900/20 z-10"></div>
        <img src="https://images.unsplash.com/photo-1615397323861-125026210f84?q=80&w=1000&auto=format&fit=crop" alt="Textura Skincare" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
        <div className="absolute z-20 text-center text-white px-12">
          <h2 className="font-syne text-4xl font-bold mb-4">Careful Baza Labs</h2>
          <p className="text-sm uppercase tracking-widest font-bold opacity-80">Access your exclusive routine</p>
        </div>
      </div>

      {/* Lado Direito: Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 md:px-20 lg:px-32">
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
              
              {needsVerification && (
                <div className="mt-4 flex flex-col gap-2">
                  <button onClick={handleLogin} className="text-[10px] font-bold uppercase tracking-widest text-white bg-gray-900 dark:bg-white dark:text-gray-900 py-2 px-4 hover:bg-baza-lavender transition-colors">
                    I have already verified my Email
                  </button>
                  <button onClick={handleResendVerification} disabled={resendLoading} className="text-[10px] font-bold uppercase tracking-widest text-red-700 dark:text-red-400 hover:text-red-900 underline text-left mt-2">
                    {resendLoading ? 'Resending...' : 'Resend Verification Email'}
                  </button>
                </div>
              )}
              {resendMessage && <p className="mt-3 text-[10px] font-bold text-green-600 uppercase">{resendMessage}</p>}
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
                <Link to="/esqueci-minha-senha" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-mint transition-colors">{t('auth.forgot_pass')}</Link>
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