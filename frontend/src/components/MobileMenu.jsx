import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function MobileMenu({ isOpen, onClose, onOpenQuiz }) {
  // 🚀 ADICIONADO: i18n para trocar o idioma
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    onClose(); // Fecha o menu após escolher o idioma
  };

  return (
    <>
      {/* OVERLAY */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* DRAWER MENU */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] sm:w-[350px] bg-white dark:bg-gray-900 z-[80] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            {t('nav.navigation') || 'Navigation'}
          </span>
          <button onClick={onClose} className="text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors p-2 -mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-8">
          <Link to="/colecao/mais-vendidos" onClick={onClose} className="font-syne text-3xl font-bold text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
            {t('nav.bestsellers')}
          </Link>
          
          <div className="flex flex-col gap-5">
            <Link to="/shop" onClick={onClose} className="font-syne text-3xl font-bold text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
              {t('nav.shop')}
            </Link>
            <div className="flex flex-col gap-4 pl-4 border-l-2 border-baza-mint/30 dark:border-baza-mint/20 transition-colors duration-300">
              <Link to="/colecao/skincare" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.skincare')}
              </Link>
              <Link to="/colecao/fragrancias" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.fragrances')}
              </Link>
              <Link to="/colecao/banho-corpo" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.bath_body')}
              </Link>
              <Link to="/colecao/masculino" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.mens')}
              </Link>
              <Link to="/colecao/kits" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.kits')}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <span className="font-syne text-3xl font-bold text-gray-900 dark:text-white cursor-default">
              {t('nav.science')}
            </span>
            <div className="flex flex-col gap-4 pl-4 border-l-2 border-baza-mint/30 dark:border-baza-mint/20 transition-colors duration-300">
              <Link to="/ciencia/tipos-de-pele" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.skin_types')}
              </Link>
              <Link to="/ciencia/tipos-de-cabelo" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.hair_types')}
              </Link>
              <Link to="/ciencia/ativos" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.ingredients')}
              </Link>
              <Link to="/ciencia/dicas" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">
                {t('nav.tips')}
              </Link>
            </div>
          </div>
          
          <button 
            onClick={() => { onOpenQuiz(); onClose(); }} 
            className="font-syne text-3xl font-bold text-baza-lavender dark:text-baza-mint text-left transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            {t('nav.quiz')}
          </button>
          
          <Link to="/sobre" onClick={onClose} className="font-syne text-3xl font-bold text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
            {t('nav.about')}
          </Link>

          {/* 🌍 SELETOR DE IDIOMAS MOBILE (ADICIONADO AQUI) */}
          <div className="flex flex-col gap-4 pt-6 mt-4 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Idioma / Language
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => changeLanguage('pt')} className={`py-2 text-[10px] font-bold rounded-sm uppercase tracking-widest border transition-colors ${i18n.language?.startsWith('pt') ? 'bg-baza-lavender border-baza-lavender text-white dark:bg-baza-mint dark:border-baza-mint dark:text-black' : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}>PT</button>
              <button onClick={() => changeLanguage('en')} className={`py-2 text-[10px] font-bold rounded-sm uppercase tracking-widest border transition-colors ${i18n.language?.startsWith('en') ? 'bg-baza-lavender border-baza-lavender text-white dark:bg-baza-mint dark:border-baza-mint dark:text-black' : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}>EN</button>
              <button onClick={() => changeLanguage('es')} className={`py-2 text-[10px] font-bold rounded-sm uppercase tracking-widest border transition-colors ${i18n.language?.startsWith('es') ? 'bg-baza-lavender border-baza-lavender text-white dark:bg-baza-mint dark:border-baza-mint dark:text-black' : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}>ES</button>
              <button onClick={() => changeLanguage('fr')} className={`py-2 text-[10px] font-bold rounded-sm uppercase tracking-widest border transition-colors ${i18n.language?.startsWith('fr') ? 'bg-baza-lavender border-baza-lavender text-white dark:bg-baza-mint dark:border-baza-mint dark:text-black' : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}>FR</button>
              <button onClick={() => changeLanguage('de')} className={`py-2 text-[10px] font-bold rounded-sm uppercase tracking-widest border transition-colors ${i18n.language?.startsWith('de') ? 'bg-baza-lavender border-baza-lavender text-white dark:bg-baza-mint dark:border-baza-mint dark:text-black' : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}>DE</button>
              <button onClick={() => changeLanguage('ru')} className={`py-2 text-[10px] font-bold rounded-sm uppercase tracking-widest border transition-colors ${i18n.language?.startsWith('ru') ? 'bg-baza-lavender border-baza-lavender text-white dark:bg-baza-mint dark:border-baza-mint dark:text-black' : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}>RU</button>
              <button onClick={() => changeLanguage('zh')} className={`py-2 text-[10px] font-bold rounded-sm uppercase tracking-widest border transition-colors ${i18n.language?.startsWith('zh') ? 'bg-baza-lavender border-baza-lavender text-white dark:bg-baza-mint dark:border-baza-mint dark:text-black' : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}>ZH</button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black transition-colors duration-300 mt-auto">
          <Link to="/login" onClick={onClose} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:border-gray-900 dark:hover:border-white transition-colors shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            {t('auth.login_btn')}
          </Link>
        </div>
      </div>
    </>
  );
}