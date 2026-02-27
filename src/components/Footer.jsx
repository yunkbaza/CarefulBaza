export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        
        <div className="flex justify-end mb-12">
          <button 
            onClick={scrollToTop}
            aria-label="Voltar ao topo da página"
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-mint transition-colors"
          >
            Voltar ao topo
            <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-8 mb-20">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Shop</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-baza-mint transition-colors">Skincare</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Fragrâncias</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Banho e Corpo</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Masculino</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Kits e Presentes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Suporte</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-baza-mint transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Frete e Entregas</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Rastrear Pedido</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Fale Conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Sobre Nós</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-baza-mint transition-colors">A Marca</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Nossa Ciência</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Sustentabilidade</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Termos de Serviço</a></li>
              <li><a href="#" className="hover:text-baza-mint transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-baza-lavender hover:text-white transition-colors font-medium">Menu de Acessibilidade</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-800">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
            &copy; {new Date().getFullYear()} Careful Baza. Todos os direitos reservados.
          </p>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center p-1">
              <img src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/cards/visa.svg" alt="Visa" className="w-full h-full object-contain" />
            </div>
            <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center p-1">
              <img src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/cards/mastercard.svg" alt="Mastercard" className="w-full h-full object-contain" />
            </div>
            <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center p-1">
              <img src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/cards/american-express.svg" alt="American Express" className="w-full h-full object-contain" />
            </div>
            <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center p-1.5">
              <img src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/cards/elo.svg" alt="Elo" className="w-full h-full object-contain" />
            </div>
            <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center p-1">
              <img src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/cards/hipercard.svg" alt="Hipercard" className="w-full h-full object-contain" />
            </div>
            <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center p-1">
              <img src="https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/cards/diners.svg" alt="Diners Club" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}