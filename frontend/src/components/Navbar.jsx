import logoSvg from '../assets/LogoCarefulBazaHorizontal.svg';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 

export default function Navbar({ onOpenMenu, onOpenQuiz, toggleDarkMode, isDarkMode, onOpenSearch }) {
  const { cartCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { t, i18n } = useTranslation(); 

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="flex justify-between items-center py-4 sm:py-5 px-5 sm:px-8 lg:px-12 xl:px-16 border-b border-gray-100 bg-white/80 dark:bg-gray-900/90 dark:border-gray-800 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      
      {/* Lado Esquerdo: Mobile Menu & Logo */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button 
          onClick={onOpenMenu}
          aria-label="Menu" 
          className="lg:hidden text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors flex-shrink-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <Link to="/" className="flex items-center flex-shrink-0">
          <img 
            src={logoSvg} 
            alt="Careful Baza Logo" 
            className={`h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain cursor-pointer transition-transform hover:scale-105 duration-300 ${isDarkMode ? 'invert brightness-0 filter' : ''}`} 
          />
        </Link>
      </div>

      {/* Centro: Links com Menus Suspensos Traduzidos */}
      <div className="hidden lg:flex items-center gap-6 lg:gap-8 xl:gap-14 text-[10px] xl:text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] flex-1 justify-center">
        
        <Link to="/colecao/mais-vendidos" className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender dark:after:bg-baza-mint hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors duration-300 whitespace-nowrap">
          {t('nav.bestsellers')}
        </Link>
        
        {/* DROPDOWN DO SHOP */}
        <div className="relative group py-2">
          <Link to="/shop" className="flex items-center gap-1.5 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender dark:after:bg-baza-mint group-hover:after:w-full after:transition-all after:duration-300 group-hover:text-baza-lavender dark:group-hover:text-baza-mint transition-colors duration-300 uppercase tracking-[0.2em] font-bold whitespace-nowrap">
            {t('nav.shop')}
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          
          <div className="absolute top-full left-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 w-56">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-2xl p-6 flex flex-col gap-4 rounded-sm">
              <Link to="/colecao/skincare" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.skincare')}</Link>
              <Link to="/colecao/fragrancias" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.fragrances')}</Link>
              <Link to="/colecao/banho-corpo" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.bath_body')}</Link>
              <Link to="/colecao/masculino" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.mens')}</Link>
              <Link to="/colecao/kits" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.kits')}</Link>
            </div>
          </div>
        </div>

        {/* DROPDOWN DE A CIÊNCIA */}
        <div className="relative group py-2">
          <span className="flex items-center gap-1.5 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender dark:after:bg-baza-mint group-hover:after:w-full after:transition-all after:duration-300 group-hover:text-baza-lavender dark:group-hover:text-baza-mint transition-colors duration-300 uppercase tracking-[0.2em] font-bold cursor-default whitespace-nowrap">
            {t('nav.science')}
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 w-56">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-2xl p-6 flex flex-col gap-4 rounded-sm">
              <Link to="/ciencia/tipos-de-pele" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.skin_types')}</Link>
              <Link to="/ciencia/tipos-de-cabelo" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.hair_types')}</Link>
              <Link to="/ciencia/ativos" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.ingredients')}</Link>
              <Link to="/ciencia/dicas" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> {t('nav.tips')}</Link>
            </div>
          </div>
        </div>

        <button 
          onClick={onOpenQuiz} 
          className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender dark:after:bg-baza-mint hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors duration-300 uppercase tracking-[0.2em] font-bold whitespace-nowrap"
        >
          {t('nav.quiz')}
        </button>
        <Link to="/sobre" className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender dark:after:bg-baza-mint hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors duration-300 whitespace-nowrap">
          {t('nav.about')}
        </Link>
      </div>

      {/* Lado Direito: Ferramentas e Seletor de Idioma */}
      <div className="flex items-center justify-end gap-4 sm:gap-5 md:gap-6 text-gray-900 dark:text-white flex-shrink-0">
        
        {/* SELETOR DE IDIOMA */}
        <div className="relative group hidden lg:block py-2">
          <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            {i18n.language ? i18n.language.substring(0, 2).toUpperCase() : 'EN'}
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="absolute top-full right-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col rounded-sm min-w-[140px] overflow-hidden">
              <button onClick={() => changeLanguage('en')} className={`px-5 py-3 text-[10px] font-bold text-left uppercase tracking-widest transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${i18n.language.startsWith('en') ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500'}`}>English</button>
              <button onClick={() => changeLanguage('fr')} className={`px-5 py-3 text-[10px] font-bold text-left uppercase tracking-widest transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 ${i18n.language.startsWith('fr') ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500'}`}>Français</button>
              <button onClick={() => changeLanguage('de')} className={`px-5 py-3 text-[10px] font-bold text-left uppercase tracking-widest transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 ${i18n.language.startsWith('de') ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500'}`}>Deutsch</button>
              <button onClick={() => changeLanguage('es')} className={`px-5 py-3 text-[10px] font-bold text-left uppercase tracking-widest transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 ${i18n.language.startsWith('es') ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500'}`}>Español</button>
              <button onClick={() => changeLanguage('pt')} className={`px-5 py-3 text-[10px] font-bold text-left uppercase tracking-widest transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 ${i18n.language.startsWith('pt') ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500'}`}>Português</button>
              <button onClick={() => changeLanguage('ru')} className={`px-5 py-3 text-[10px] font-bold text-left uppercase tracking-widest transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 ${i18n.language.startsWith('ru') ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500'}`}>Русский</button>
              <button onClick={() => changeLanguage('zh')} className={`px-5 py-3 text-[10px] font-bold text-left uppercase tracking-widest transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 ${i18n.language.startsWith('zh') ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500'}`}>中文</button>
            </div>
          </div>
        </div>

        <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors flex-shrink-0">
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          )}
        </button>
        
        <button onClick={onOpenSearch} aria-label="Search products" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>

        {user ? (
          <Link 
            to="/minha-conta" 
            aria-label="Dashboard" 
            className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors hidden md:block"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 inline-block align-middle max-w-[120px] truncate">
              {t('nav.hello')}, {user.name.split(' ')[0]}
            </span>
          </Link>
        ) : (
          <Link to="/login" aria-label="Login" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors hidden md:block flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>
        )}
        
        <button onClick={() => setIsCartOpen(true)} aria-label="Cart" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors flex items-center gap-2 relative flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-baza-mint text-baza-lavender text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}