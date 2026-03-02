import { Link } from 'react-router-dom';

// AQUI: Adicionamos o onOpenQuiz nas propriedades
export default function MobileMenu({ isOpen, onClose, onOpenQuiz }) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 left-0 h-full w-[85%] sm:w-[350px] bg-white dark:bg-gray-900 z-[80] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Navegação</span>
          <button onClick={onClose} className="text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors p-2 -mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-8">
          <Link to="/colecao/mais-vendidos" onClick={onClose} className="font-syne text-3xl font-bold text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
            Mais Vendidos
          </Link>
          
          <div className="flex flex-col gap-5">
            <Link to="/shop" onClick={onClose} className="font-syne text-3xl font-bold text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
              Shop
            </Link>
            <div className="flex flex-col gap-4 pl-4 border-l-2 border-baza-mint/30 dark:border-baza-mint/20 transition-colors duration-300">
              <Link to="/colecao/skincare" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">Skincare</Link>
              <Link to="/colecao/fragrancias" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">Fragrâncias</Link>
              <Link to="/colecao/banho-corpo" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">Banho e Corpo</Link>
              <Link to="/colecao/masculino" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">Masculino</Link>
              <Link to="/colecao/kits" onClick={onClose} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint uppercase tracking-widest transition-colors">Kits e Presentes</Link>
            </div>
          </div>

          <Link to="/ciencia/ativos" onClick={onClose} className="font-syne text-3xl font-bold text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
            A Ciência
          </Link>
          
          {/* AQUI: O botão do Quiz agora aciona a tela inteira de perguntas e fecha o menu sozinho */}
          <button 
            onClick={() => { onOpenQuiz(); onClose(); }} 
            className="font-syne text-3xl font-bold text-baza-lavender dark:text-baza-mint text-left transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            Quiz de Rotina
          </button>
          
          <Link to="/sobre" onClick={onClose} className="font-syne text-3xl font-bold text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
            Sobre Nós
          </Link>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black transition-colors duration-300">
          <Link to="/login" onClick={onClose} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:border-gray-900 dark:hover:border-white transition-colors shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Acessar Conta
          </Link>
        </div>
      </div>
    </>
  );
}