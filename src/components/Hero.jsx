import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <main className="flex flex-col lg:flex-row min-h-[85vh]">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-baza-mint text-baza-lavender px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm">
            Fórmula Inovadora
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 transition-colors">
            Uso Diário
          </span>
        </div>
        
        <h1 className="font-syne text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-8 relative z-10 transition-colors duration-300">
          A pureza que a <span className="italic font-serif font-normal text-baza-lavender dark:text-baza-mint relative inline-block whitespace-nowrap">
            sua pele
            <span className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-baza-mint/40 dark:bg-baza-lavender/40 -z-10 -rotate-2 transform"></span>
          </span> sente.
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-md leading-relaxed transition-colors duration-300">
          Fórmulas limpas desenvolvidas com ativos puros. Descubra o mais alto padrão em cuidados faciais, sem abrir mão da leveza.
        </p>
        
        <div className="flex flex-col items-start gap-4">
          
          {/* AQUI ESTÁ A MÁGICA: O botão agora é um Link que leva para a página /shop */}
          <Link 
            to="/shop" 
            className="group w-fit bg-baza-lavender dark:bg-baza-mint text-white dark:text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 hover:text-baza-mint transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3"
          >
            <span>Descobrir Tratamentos</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-baza-lavender dark:text-baza-mint">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">
              +2.500 clientes
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-[50vh] lg:min-h-full overflow-hidden bg-gray-50 dark:bg-black border-l border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <img 
          src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1200&auto=format&fit=crop" 
          alt="Textura de Sérum Skincare" 
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-[3000ms]"
        />
      </div>
    </main>
  );
}