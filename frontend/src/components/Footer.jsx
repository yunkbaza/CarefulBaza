import { useState } from 'react'; // 👈 Importamos o useState
import logoSvg from '../assets/LogoCarefulBazaHorizontal.svg';
import logoMaster from '../assets/LogoMaster.png';
import logoVisa from '../assets/LogoVisa.png';
import logoAmerican from '../assets/LogoAmerican.png';
import logoElo from '../assets/LogoElo.png';
import logoHipercard from '../assets/LogoHipercard.png';  
import logoBoleto from '../assets/LogoBoleto.png';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  
  // 🚀 ESTADOS DA NEWSLETTER
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  // 🚀 FUNÇÃO QUE PROCESSA A INSCRIÇÃO
  const handleSubscribe = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    if (!email) return;

    setStatus('loading');

    try {
      // Aqui entrará o fetch() para o seu backend no futuro
      // Ex: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
      
      // Simulando tempo de resposta do servidor (1 segundo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setEmail(''); // Limpa o campo
      
      // Volta ao botão normal depois de 3 segundos
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Erro na subscrição da newsletter:", error); // 👈 Agora o ESLint fica feliz!
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

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
            <div className="flex items-center gap-4 flex-wrap">
              <a href="https://www.instagram.com/carefulbazaoficial?igsh=cTRsdGIwa3Bva2Zh&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-gray-700 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-baza-lavender hover:border-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.tiktok.com/@carefulbazaoficial?_r=1&_t=ZS-94cJLlmG4uL" target="_blank" rel="noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full border border-gray-700 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-baza-lavender hover:border-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint transition-all">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61583764692760" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-gray-700 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-baza-lavender hover:border-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://youtube.com/@carefulbaza?si=faFJldIwY8QRlj-J" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full border border-gray-700 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-baza-lavender hover:border-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://pin.it/1NRyPYf9p" target="_blank" rel="noreferrer" aria-label="Pinterest" className="w-10 h-10 rounded-full border border-gray-700 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-baza-lavender hover:border-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint transition-all">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.602 0 12.017 0z"/></svg>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 w-full bg-gray-800/50 dark:bg-gray-900/50 p-8 rounded-sm border border-gray-800 dark:border-gray-900 transition-colors duration-300">
            <h3 className="font-syne text-xl font-bold text-white mb-2">{t('footer.newsletter_title')}</h3>
            <p className="text-gray-400 text-xs mb-6">{t('footer.newsletter_sub')}</p>
            {/* 🚀 FORMULÁRIO ATUALIZADO */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading' || status === 'success'}
                placeholder={t('footer.newsletter_placeholder')} 
                className="flex-1 bg-gray-900 dark:bg-black border border-gray-700 dark:border-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint disabled:opacity-50 transition-colors duration-300"
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender hover:text-white dark:hover:bg-baza-mint dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 w-[140px]"
              >
                {status === 'loading' ? '...' : 
                 status === 'success' ? '✔' : 
                 status === 'error' ? 'Erro' : 
                 t('footer.newsletter_btn')}
              </button>
            </form>
            {/* Feedback Visual Extra */}
            {status === 'success' && (
              <p className="text-baza-mint text-xs mt-3 transition-opacity duration-300">
                Obrigado por se inscrever!
              </p>
            )}
          </div>
        </div>

        {/* ... Restante do Footer que não mudou ... */}
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
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoMaster} alt="Mastercard" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoVisa} alt="Visa" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoAmerican} alt="American Express" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoElo} alt="Elo" className="w-full h-full object-contain" /></div>
              <div className="h-7 w-11 bg-white rounded-sm flex items-center justify-center p-1 overflow-hidden"><img src={logoHipercard} alt="Hipercard" className="w-full h-full object-contain" /></div>
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