import logoSvg from '../assets/LogoCarefulBazaHorizontal.svg';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Navbar({ onOpenMenu, onOpenQuiz, toggleDarkMode, isDarkMode }) {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="flex justify-between items-center py-5 px-8 md:px-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <button 
          onClick={onOpenMenu}
          aria-label="Abrir menu de navegação" 
          className="lg:hidden text-gray-900 hover:text-baza-lavender transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <Link to="/" className="flex items-center">
          <img 
            src={logoSvg} 
            alt="Careful Baza Logo" 
            className="h-14 md:h-16 w-auto object-contain cursor-pointer transition-transform hover:scale-105 duration-300" 
          />
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-10 xl:gap-14 text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em]">
        <Link to="/colecao/mais-vendidos" className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender transition-colors duration-300">
          Mais Vendidos
        </Link>
        
        <div className="relative group py-2">
          <Link to="/shop" className="flex items-center gap-1.5 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender group-hover:after:w-full after:transition-all after:duration-300 group-hover:text-baza-lavender transition-colors duration-300 uppercase tracking-[0.2em] font-bold">
            Shop
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          
          <div className="absolute top-full left-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 w-56">
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl p-6 flex flex-col gap-4 rounded-sm">
              <Link to="/colecao/skincare" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Skincare</Link>
              <Link to="/colecao/fragrancias" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Fragrâncias</Link>
              <Link to="/colecao/banho-corpo" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Banho e Corpo</Link>
              <Link to="/colecao/masculino" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Masculino</Link>
              <Link to="/colecao/kits" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Kits e Presentes</Link>
            </div>
          </div>
        </div>

        <div className="relative group py-2">
          <span className="flex items-center gap-1.5 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender group-hover:after:w-full after:transition-all after:duration-300 group-hover:text-baza-lavender transition-colors duration-300 uppercase tracking-[0.2em] font-bold cursor-default">
            A Ciência
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 w-56">
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl p-6 flex flex-col gap-4 rounded-sm">
              <Link to="/ciencia/tipos-de-pele" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Tipos de Pele</Link>
              <Link to="/ciencia/tipos-de-cabelo" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Tipos de Cabelo</Link>
              <Link to="/ciencia/ativos" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Guia de Ativos</Link>
              <Link to="/ciencia/dicas" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-baza-mint"></span> Dicas e Rotinas</Link>
            </div>
          </div>
        </div>

        <button 
          onClick={onOpenQuiz} 
          className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender transition-colors duration-300 uppercase tracking-[0.2em] font-bold"
        >
          Quiz de Rotina
        </button>
        <Link to="/sobre" className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender transition-colors duration-300">
          Sobre Nós
        </Link>
      </div>

      <div className="flex items-center gap-5 md:gap-7 text-gray-900">
        
        {/* FUNÇÃO NOVA 1: Botão de Dark Mode (Lua/Sol) */}
        <button 
          onClick={toggleDarkMode}
          aria-label="Alternar Modo Escuro" 
          className="hover:text-baza-lavender transition-colors"
        >
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          )}
        </button>

        {/* FUNÇÃO NOVA 2: Rastreio de Pedidos (Caminhãozinho) */}
        <Link 
          to="/rastreio" 
          aria-label="Rastrear Pedido" 
          className="hover:text-baza-lavender transition-colors hidden md:block"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
        </Link>

        {/* Botão de Busca Preparado */}
        <button 
          onClick={() => alert('A gaveta de busca será implementada aqui!')}
          aria-label="Buscar produtos" 
          className="hover:text-baza-lavender transition-colors hidden sm:block"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        
        {/* Botão de Login/Usuário Preparado */}
        <button 
          onClick={() => alert('O painel de login/conta será implementado aqui!')}
          aria-label="Acessar conta do usuário" 
          className="hover:text-baza-lavender transition-colors hidden md:block"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
        
        <button 
          onClick={() => setIsCartOpen(true)}
          aria-label="Ver sacola de compras" 
          className="hover:text-baza-lavender transition-colors flex items-center gap-2 relative"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-baza-mint text-baza-lavender text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}