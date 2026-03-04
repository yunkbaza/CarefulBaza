import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('auth.verify_error_token'));
      return;
    }

    const verifyEmail = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        setStatus('success');
        setMessage(t('auth.verify_success_msg'));
      } catch (err) {
        setStatus('error');
        setMessage(err.message || t('auth.verify_error_title'));
      }
    };

    verifyEmail();
  }, [token, t]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-10 max-w-lg w-full text-center border border-gray-100 dark:border-gray-700 shadow-xl rounded-sm">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-baza-lavender rounded-full animate-spin mb-6"></div>
            <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white">
              {t('auth.verify_loading')}
            </h2>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('auth.verify_success_title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>
            <Link to="/login" className="inline-block w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint transition-colors">
              {t('auth.verify_login_btn')}
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('auth.verify_error_title')}
            </h2>
            <p className="text-red-500 dark:text-red-400 mb-8">{message}</p>
            <Link to="/" className="inline-block w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint transition-colors">
              {t('auth.verify_back_btn')}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}