import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="relative py-24 md:py-32 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gray-50 dark:bg-black/50 z-0"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="text-baza-mint font-bold uppercase tracking-[0.2em] text-[10px] mb-6 block">
            O Nosso Modelo de Excelência
          </span>
          <h1 className="font-syne text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            A Nova Era da <br className="hidden md:block" /> Curadoria Cosmética.
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            A Careful Baza Labs não é apenas uma marca. Somos um laboratório de seleção global dedicado a encontrar as fórmulas mais avançadas do mundo e trazê-las diretamente para a sua rotina.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION 1: O PROBLEMA E A SOLUÇÃO */}
      <section className="py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-baza-mint/10 z-10 mix-blend-multiply"></div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" 
                alt="Laboratório de Testes" 
                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Do laboratório de origem direto para a sua pele.
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
              <p>
                O mercado tradicional de beleza está saturado de intermediários. O produto sai do fabricante, vai para um distribuidor internacional, passa por um revendedor nacional, até chegar à prateleira de uma loja física. Cada uma dessas etapas adiciona margens de lucro exorbitantes que você paga.
              </p>
              <p>
                Na <strong className="text-gray-900 dark:text-white">Careful Baza Labs</strong>, redesenhámos a engenharia de consumo. Atuamos com uma rede de parceiros e fabricantes de elite ao redor do globo. O nosso trabalho? Testar, analisar ingredientes e aprovar apenas o que entrega resultados clínicos reais.
              </p>
              <p>
                Quando você escolhe um tratamento na nossa plataforma, ele é despachado diretamente dos nossos fornecedores homologados. Sem armazéns caros, sem intermediários. Apenas ciência, pureza e alta performance a um preço inteligente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OS 3 PILARES DA CURADORIA (Ideal para Dropshipping) */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-4">Os Pilares da Nossa Curadoria</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">O rigor por trás de cada frasco aprovado pela nossa equipa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="bg-white dark:bg-gray-800 p-10 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-4">Sourcing Global</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Buscamos a excelência onde ela estiver. Mapeamos laboratórios pioneiros, desde a inovação do skincare asiático até a pureza dos extratos botânicos europeus.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-10 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-4">Seleção Criteriosa</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Reprovamos 90% dos produtos que testamos. Analisamos minuciosamente as fórmulas, a concentração de ativos e a ausência de toxinas antes de os apresentar a si.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-10 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-4">Luxo Inteligente</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Ao eliminar o custo operacional de lojas físicas e estoques ociosos, conseguimos entregar ativos de nível clínico com um valor incomparável no mercado.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 px-6 md:px-16 text-center max-w-4xl mx-auto">
        <h2 className="font-syne text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          A ciência exata para a sua rotina.
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">
          Nós já fizemos a pesquisa e o teste clínico. Agora, descubra os resultados.
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all duration-300 shadow-xl"
        >
          Explorar o Catálogo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </section>

    </main>
  );
}