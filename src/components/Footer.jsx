import logoSvg from '../assets/LogoCarefulBazaHorizontal.svg';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 border-t-4 border-baza-mint dark:bg-black dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16 pb-16 border-b border-gray-800">
          <div className="lg:w-1/3">
            <img 
              src={logoSvg} 
              alt="Careful Baza Logo" 
              className="h-12 w-auto object-contain invert brightness-0 filter mb-6" 
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A ciência da pureza. Desenvolvemos fórmulas dermatológicas de alta performance, sem ingredientes suspeitos e com resultados comprovados.
            </p>
          </div>

          <div className="lg:w-1/2 w-full bg-gray-800/50 p-8 rounded-sm border border-gray-800">
            <h3 className="font-syne text-xl font-bold text-white mb-2">Junte-se ao Baza Labs</h3>
            <p className="text-gray-400 text-xs mb-6">Receba lançamentos antecipados e 15% off no seu primeiro pedido.</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="flex-1 bg-gray-900 border border-gray-700 px-4 py-3 text-sm text-white outline-none focus:border-baza-lavender transition-colors"
              />
              <button className="bg-white text-gray-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender hover:text-white transition-colors">
                Assinar
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h4 className="font-syne font-bold text-white mb-6 uppercase text-sm tracking-widest">Shop</h4>
            <ul className="space-y-4 text-xs font-medium text-gray-400">
              <li><Link to="/shop" className="hover:text-baza-lavender transition-colors">Todos os Produtos</Link></li>
              <li><Link to="/colecao/mais-vendidos" className="hover:text-baza-lavender transition-colors">Mais Vendidos</Link></li>
              <li><Link to="/colecao/skincare" className="hover:text-baza-lavender transition-colors">Skincare</Link></li>
              <li><Link to="/colecao/kits" className="hover:text-baza-lavender transition-colors">Kits</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-syne font-bold text-white mb-6 uppercase text-sm tracking-widest">A Ciência</h4>
            <ul className="space-y-4 text-xs font-medium text-gray-400">
              <li><Link to="/ciencia/tipos-de-pele" className="hover:text-baza-lavender transition-colors">Tipos de Pele</Link></li>
              <li><Link to="/ciencia/ativos" className="hover:text-baza-lavender transition-colors">Guia de Ativos</Link></li>
              <li><Link to="/ciencia/dicas" className="hover:text-baza-lavender transition-colors">Dicas e Rotinas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-syne font-bold text-white mb-6 uppercase text-sm tracking-widest">Suporte</h4>
            <ul className="space-y-4 text-xs font-medium text-gray-400">
              <li><Link to="/rastreio" className="hover:text-baza-lavender transition-colors">Rastrear Pedido</Link></li>
              <li><a href="#" className="hover:text-baza-lavender transition-colors">Trocas e Devoluções</a></li>
              <li><a href="mailto:contato@carefulbaza.com.br" className="hover:text-baza-lavender transition-colors">contato@carefulbaza.com.br</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-syne font-bold text-white mb-6 uppercase text-sm tracking-widest">Segurança</h4>
            <div className="flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-baza-mint"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span className="text-xs text-gray-400">Ambiente Seguro</span>
            </div>
            
            {/* Bandeiras de Cartão (Estética Clean) */}
            <div className="flex flex-wrap gap-3 opacity-70">
              {/* PIX */}
              <div className="h-8 w-12 bg-white rounded-sm flex items-center justify-center p-1">
                <svg viewBox="0 0 24 24" fill="#32BCAD" className="w-full h-full"><path d="M6.864 9.043l4.673-4.673a.654.654 0 0 1 .926 0l4.673 4.673a.654.654 0 0 1 0 .926l-4.673 4.673a.654.654 0 0 1-.926 0L6.864 9.969a.654.654 0 0 1 0-.926zm10.272.926l3.522-3.522a.654.654 0 0 0 0-.926L16.205 1.068a.654.654 0 0 0-.926 0l-3.522 3.522a.654.654 0 0 0 0 .926l4.453 4.453a.654.654 0 0 0 .926 0zM12.463 22.932l4.453-4.453a.654.654 0 0 0 0-.926l-3.522-3.522a.654.654 0 0 0-.926 0l-4.453 4.453a.654.654 0 0 0 0 .926l3.522 3.522a.654.654 0 0 0 .926 0zM3.342 18.479l3.522-3.522a.654.654 0 0 0 0-.926L2.41 9.578a.654.654 0 0 0-.926 0L1.068 9.994a.654.654 0 0 0 0 .926l4.453 4.453a.654.654 0 0 0 .926 0l-3.105-3.105z"/></svg>
              </div>
              {/* MASTERCARD */}
              <div className="h-8 w-12 bg-white rounded-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8"><circle cx="9" cy="12" r="5" fill="#ea001b"/><circle cx="15" cy="12" r="5" fill="#f79e1b" fillOpacity="0.8"/></svg>
              </div>
              {/* VISA */}
              <div className="h-8 w-12 bg-white rounded-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8"><text x="1" y="16" fontFamily="Arial" fontWeight="900" fontStyle="italic" fill="#1434CB" fontSize="11">VISA</text></svg>
              </div>
              {/* BOLETO (Ícone Código de Barras) */}
              <div className="h-8 w-12 bg-white rounded-sm flex items-center justify-center">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M3 5v14M7 5v14M11 5v14M13 5v14M17 5v14M21 5v14"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-800 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <p>© {new Date().getFullYear()} CAREFUL BAZA LABS. TODOS OS DIREITOS RESERVADOS.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Termos de Serviço</a>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}