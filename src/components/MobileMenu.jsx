export default function MobileMenu({ isOpen, onClose }) {
  return (
    <>
      {/* Fundo escuro (Clica para fechar) */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[70] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Gaveta do Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] sm:w-[350px] bg-white z-[80] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Navegação</span>
          <button onClick={onClose} className="text-gray-900 hover:text-baza-lavender transition-colors p-2 -mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Links Principais */}
        <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-8">
          <a href="#" className="font-syne text-3xl font-bold text-gray-900 hover:text-baza-lavender transition-colors">Mais Vendidos</a>
          
          <div className="flex flex-col gap-5">
            <span className="font-syne text-3xl font-bold text-gray-900">Shop</span>
            <div className="flex flex-col gap-4 pl-4 border-l-2 border-baza-mint/30">
              <a href="#" className="text-xs font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors">Skincare</a>
              <a href="#" className="text-xs font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors">Fragrâncias</a>
              <a href="#" className="text-xs font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors">Banho e Corpo</a>
              <a href="#" className="text-xs font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors">Masculino</a>
              <a href="#" className="text-xs font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors">Kits e Presentes</a>
            </div>
          </div>

          <a href="#" className="font-syne text-3xl font-bold text-gray-900 hover:text-baza-lavender transition-colors">A Ciência</a>
          <a href="#" className="font-syne text-3xl font-bold text-baza-lavender transition-colors">Quiz de Rotina</a>
          <a href="#" className="font-syne text-3xl font-bold text-gray-900 hover:text-baza-lavender transition-colors">Sobre Nós</a>
        </div>

        {/* Rodapé do Menu (Login) */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:border-gray-900 transition-colors shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Acessar Conta
          </button>
        </div>
      </div>
    </>
  );
}