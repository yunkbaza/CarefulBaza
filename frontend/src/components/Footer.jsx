import logoSvg from '../assets/LogoCarefulBazaHorizontal.svg';
import logoPix from '../assets/LogoPix.png';
import logoMaster from '../assets/LogoMaster.png';
import logoVisa from '../assets/LogoVisa.png';
import logoAmerican from '../assets/LogoAmerican.png';
import logoElo from '../assets/LogoElo.png';
import logoHipercard from '../assets/LogoHipercard.png';
import logoDiners from '../assets/LogoDiners.png';
import logoBoleto from '../assets/LogoBoleto.png';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t-4 border-baza-mint dark:bg-black dark:border-baza-mint transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16 pb-16 border-b border-gray-800 dark:border-gray-900 transition-colors duration-300">
          <div className="lg:w-1/3">
            <img 
              src={logoSvg} 
              alt="Careful Baza Logo" 
              className="h-12 w-auto object-contain invert brightness-0 filter mb-6" 
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.desc')}
            </p>
            {/* Redes Sociais */}
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gray-700 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-baza-lavender hover:border-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gray-700 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-baza-lavender hover:border-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 w-full bg-gray-800/50 dark:bg-gray-900/50 p-8 rounded-sm border border-gray-800 dark:border-gray-900 transition-colors duration-300">
            <h3 className="font-syne text-xl font-bold text-white mb-2">{t('footer.newsletter_title')}</h3>
            <p className="text-gray-400 text-xs mb-6">{t('footer.newsletter_sub')}</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder={t('footer.newsletter_placeholder')} 
                className="flex-1 bg-gray-900 dark:bg-black border border-gray-700 dark:border-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors duration-300"
              />
              <button type="button" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender hover:text-white dark:hover:bg-baza-mint dark:hover:text-black transition-colors duration-300">
                {t('footer.newsletter_btn')}
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h4 className="font-syne font-bold text-white mb-6 uppercase text-sm tracking-widest">{t('nav.shop')}</h4>
            <ul className="space-y-4 text-xs font-medium text-gray-400">
              <li><Link to="/shop" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('shop.titles.all')}</Link></li>
              <li><Link to="/colecao/mais-vendidos" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('nav.bestsellers')}</Link></li>
              <li><Link to="/colecao/skincare" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('nav.skincare')}</Link></li>
              <li><Link to="/colecao/kits" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('nav.kits')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-syne font-bold text-white mb-6 uppercase text-sm tracking-widest">{t('nav.science')}</h4>
            <ul className="space-y-4 text-xs font-medium text-gray-400">
              <li><Link to="/ciencia/tipos-de-pele" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('nav.skin_types')}</Link></li>
              <li><Link to="/ciencia/ativos" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('nav.ingredients')}</Link></li>
              <li><Link to="/ciencia/dicas" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('nav.tips')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-syne font-bold text-white mb-6 uppercase text-sm tracking-widest">{t('footer.support')}</h4>
            <ul className="space-y-4 text-xs font-medium text-gray-400">
              <li><Link to="/rastreio" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('tracking.title')}</Link></li>
              <li><Link to="/info/trocas" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('footer.returns')}</Link></li>
              <li><Link to="/info/faq" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('footer.faq')}</Link></li>
              <li><a href="mailto:carefulbaza@gmail.com" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">carefulbaza@gmail.com</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-syne font-bold text-white mb-6 uppercase text-sm tracking-widest">{t('footer.security')}</h4>
            <div className="flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-baza-mint"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span className="text-xs text-gray-400">{t('footer.secure_env')}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2.5 opacity-90 w-fit">
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoPix} alt="Pix" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoMaster} alt="Mastercard" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoVisa} alt="Visa" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoAmerican} alt="American Express" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoElo} alt="Elo" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoHipercard} alt="Hipercard" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoDiners} alt="Diners Club" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoBoleto} alt="Boleto Bancário" className="w-full h-full object-contain" /></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-800 dark:border-gray-900 text-[10px] text-gray-500 uppercase tracking-widest font-bold transition-colors duration-300">
          <p>© {new Date().getFullYear()} CAREFUL BAZA LABS. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <Link to="/info/termos" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('footer.terms')}</Link>
            <span className="hidden md:inline">•</span>
            <Link to="/info/privacidade" className="hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">{t('footer.privacy')}</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}