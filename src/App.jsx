import ProductGrid from './components/ProductGrid';
import logoSvg from './assets/LogoCarefulBaza.svg'; 

export default function App() {
  return (
    <div className="min-h-screen font-sans bg-white selection:bg-baza-mint selection:text-gray-900 scroll-smooth">
      
      <div className="bg-baza-mint text-baza-lavender text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-center py-2.5 px-4 z-[60] relative">
        <span className="text-baza-lavender mr-2">✦</span> 
        Frete Grátis para todo o Brasil em compras acima de R$ 199 
        <span className="text-baza-lavender ml-2">✦</span>
      </div>

      <nav className="flex justify-between items-center py-5 px-8 md:px-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        
        <div className="flex items-center gap-6">
          <button aria-label="Abrir menu de navegação" className="lg:hidden text-gray-900 hover:text-baza-lavender transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>

          <img 
            src={logoSvg} 
            alt="Careful Baza Logo" 
            className="h-14 md:h-16 w-auto object-contain cursor-pointer" 
          />
        </div>

        <div className="hidden lg:flex items-center gap-10 xl:gap-14 text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em]">
          
          <a href="#" className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender transition-colors duration-300">
            Mais Vendidos
          </a>
          
          <div className="relative group py-2">
            <button className="flex items-center gap-1.5 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender group-hover:after:w-full after:transition-all after:duration-300 group-hover:text-baza-lavender transition-colors duration-300 uppercase tracking-[0.2em] font-bold">
              Shop
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className="absolute top-full left-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 w-56">
              <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl p-6 flex flex-col gap-4 rounded-sm">
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Skincare
                </a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Fragrâncias
                </a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Banho e Corpo
                </a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Masculino
                </a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Kits e Presentes
                </a>
              </div>
            </div>
          </div>

          <div className="relative group py-2">
            <button className="flex items-center gap-1.5 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender group-hover:after:w-full after:transition-all after:duration-300 group-hover:text-baza-lavender transition-colors duration-300 uppercase tracking-[0.2em] font-bold">
              A Ciência
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 w-56">
              <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl p-6 flex flex-col gap-4 rounded-sm">
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Tipos de Pele
                </a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Tipos de Cabelo
                </a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Guia de Ativos
                </a>
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-baza-lavender uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-baza-mint"></span> Dicas e Rotinas
                </a>
              </div>
            </div>
          </div>

          <a href="#" className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender transition-colors duration-300">
            Quiz de Rotina
          </a>
          <a href="#" className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-baza-lavender hover:after:w-full after:transition-all after:duration-300 hover:text-baza-lavender transition-colors duration-300">
            Sobre Nós
          </a>

        </div>

        <div className="flex items-center gap-6 md:gap-8 text-gray-900">
          <button aria-label="Buscar produtos" className="hover:text-baza-lavender transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          
          <button aria-label="Acessar conta do usuário" className="hover:text-baza-lavender transition-colors hidden md:block">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </button>
          
          <button aria-label="Ver sacola de compras" className="hover:text-baza-lavender transition-colors flex items-center gap-2 relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span className="absolute -top-2 -right-3 bg-baza-mint text-baza-lavender text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-gray-100">0</span>
          </button>
        </div>
      </nav>

      <main className="flex flex-col lg:flex-row min-h-[85vh]">
        
        <div className="flex-1 flex flex-col justify-center px-8 md:px-20 py-16 bg-white">
          
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-baza-mint text-baza-lavender px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm">
              Fórmula Inovadora
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Uso Diário
            </span>
          </div>
          
          <h1 className="font-syne text-5xl md:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-8">
            A pureza que a <span className="italic font-serif font-normal text-baza-lavender">sua pele</span> sente.
          </h1>
          
          <p className="text-gray-600 text-lg mb-10 max-w-md leading-relaxed">
            Fórmulas limpas desenvolvidas com ativos puros. Descubra o mais alto padrão em cuidados faciais, sem abrir mão da leveza.
          </p>
          
          <div className="flex flex-col items-start gap-4">
            <button className="group w-fit bg-baza-lavender text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3">
              <span>Descobrir Tratamentos</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-baza-mint">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                +2.500 clientes
              </span>
            </div>
          </div>

        </div>

        <div className="flex-1 relative min-h-[50vh] lg:min-h-full overflow-hidden bg-gray-50">
          <img 
            src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1200&auto=format&fit=crop" 
            alt="Textura de Sérum Skincare" 
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms]"
          />
        </div>

      </main>

      <div className="w-full bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8 text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em]">
          <div className="flex items-center gap-3">
            <span className="text-baza-mint font-syne text-sm">01</span> Dermatologicamente Testado
          </div>
          <div className="flex items-center gap-3">
            <span className="text-baza-mint font-syne text-sm">02</span> Eficácia Comprovada
          </div>
          <div className="flex items-center gap-3">
            <span className="text-baza-mint font-syne text-sm">03</span> Ativos Concentrados
          </div>
        </div>
      </div>

      <div className="bg-white pt-24 pb-32 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 mb-4">Rotina de Alta Performance</h2>
          <p className="text-gray-500 text-sm uppercase font-bold tracking-widest">Selecione o seu tratamento</p>
        </div>
        <ProductGrid />
      </div>

    </div>
  )
}