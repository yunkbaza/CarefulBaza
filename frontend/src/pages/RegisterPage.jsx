import { useState } from 'react';
import { Link } from 'react-router-dom'; // Removido o useNavigate daqui
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const { t } = useTranslation();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error creating account.');

      setIsRegistered(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="hidden lg:flex w-1/2 bg-gray-50 dark:bg-black relative items-center justify-center overflow-hidden border-r border-gray-100 dark:border-gray-800">
        <div className="absolute inset-0 bg-baza-mint/10 dark:bg-baza-lavender/10 z-10 mix-blend-multiply"></div>
        <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop" alt="Textura Skincare" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
        <div className="absolute z-20 text-center text-white px-12">
          <h2 className="font-syne text-4xl font-bold mb-4">Careful Baza Labs</h2>
          <p className="text-sm uppercase tracking-widest font-bold opacity-80">Join our pure beauty ritual</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 md:px-20 lg:px-32">
        <div className="w-full max-w-md mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors mb-12">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t('auth.back_home')}
          </Link>

          {isRegistered ? (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h1 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-4">Please Verify Your Email</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 leading-relaxed">
                We've sent a verification link to <strong>{email}</strong>. 
                Please check your inbox (and spam) to activate your account before logging in.
              </p>
              <Link to="/login" className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors shadow-lg">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <h1 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.register_title')}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Fill in your details to create an account.</p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">{t('auth.name_label')}</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">{t('auth.email_label')}</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">{t('auth.pass_label')}</label>
                  <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="Min. 6 characters" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors shadow-lg mt-4 flex justify-center disabled:opacity-50">
                  {loading ? <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div> : t('auth.register_btn')}
                </button>
              </form>

              <div className="mt-10 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t('auth.have_account')} <Link to="/login" className="font-bold text-gray-900 dark:text-white hover:text-baza-lavender transition-colors">{t('auth.login_btn')}</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}