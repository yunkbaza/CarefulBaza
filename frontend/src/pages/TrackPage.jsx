import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TrackPage() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const { t } = useTranslation();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!code) return;
    setStatus('loading');
    setTimeout(() => { setStatus('found'); }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-32 px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t('tracking.breadcrumb')}
        </Link>
        
        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 rounded-sm">
          <h1 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('tracking.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{t('tracking.desc')}</p>
          
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-8">
            <input 
              type="text" 
              placeholder={t('tracking.placeholder')} 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors"
            />
            <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors shadow-md">
              {t('tracking.btn')}
            </button>
          </form>

          {status === 'loading' && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-baza-lavender rounded-full animate-spin"></div>
            </div>
          )}

          {status === 'found' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-gray-100 dark:border-gray-700 pt-8">
              <span className="text-baza-mint font-bold uppercase tracking-widest text-[10px] mb-4 block">{t('tracking.status_title')}</span>
              <div className="relative pl-6 border-l-2 border-baza-mint space-y-8">
                <div className="relative">
                  <span className="absolute -left-[31px] bg-baza-mint w-4 h-4 rounded-full border-4 border-white dark:border-gray-800"></span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{t('tracking.step1')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('tracking.step1_loc')}</p>
                </div>
                <div className="relative opacity-50">
                  <span className="absolute -left-[31px] bg-gray-300 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800"></span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{t('tracking.step2')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('tracking.step2_loc')}</p>
                </div>
                <div className="relative opacity-50">
                  <span className="absolute -left-[31px] bg-gray-300 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800"></span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{t('tracking.step3')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('tracking.step3_loc')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}