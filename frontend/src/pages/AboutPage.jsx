import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pb-24">
      {/* Hero Institucional */}
      <div className="relative h-[60vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1600&auto=format&fit=crop" 
          alt="Laboratório Baza" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="relative z-10 text-center px-6">
          <span className="text-baza-mint font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">Nossa História</span>
          <h1 className="font-syne text-5xl md:text-7xl font-bold text-white mb-6">A Ciência da Pureza.</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-16 pt-16">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors mb-12">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Voltar para Home
        </Link>
      </div>

      {/* A Carta do Fundador */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 mb-24">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 md:p-12 relative transition-colors duration-300 rounded-sm">
          <svg className="absolute top-6 left-6 w-12 h-12 text-gray-200 dark:text-gray-700 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          
          <div className="relative z-10 pt-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-baza-lavender dark:text-baza-mint mb-4 block">Uma mensagem do fundador</span>
            <h2 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">"Na tecnologia, um código mal escrito quebra o sistema. Na pele, um ingrediente ruim quebra a sua barreira de proteção."</h2>
            
            <div className="prose prose-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 transition-colors">
              <p className="mb-4">
                Olá, eu sou o <strong>Allan</strong>, fundador da Careful Baza. 
              </p>
              <p className="mb-4">
                A minha jornada profissional sempre foi pautada pela exatidão da tecnologia, do desenvolvimento de sistemas e da análise de dados. Quando comecei a me aprofundar no mercado de cosméticos, percebi um padrão assustador: a maioria das marcas vende marketing, não resultados. Rótulos confusos, ingredientes de preenchimento baratos e falsas promessas.
              </p>
              <p className="mb-4">
                Nós criamos a Careful Baza em São Paulo com uma mentalidade de engenharia de software aplicada ao skincare: cada ativo precisa ter uma função clara, testada e otimizada. Se não entrega alta performance biológica, não entra na nossa fórmula. Simples assim.
              </p>
              <p>
                Meu compromisso com você não é apenas entregar cosméticos. É entregar uma operação impecável, desde a clareza das informações no nosso site até a segurança absoluta no momento do seu pagamento e a entrega garantida na sua porta.
              </p>
            </div>
            
            <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-gray-900 font-syne font-bold text-xl transition-colors">
                A.
              </div>
              <div>
                <p className="font-syne font-bold text-gray-900 dark:text-white transition-colors">Allan</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold transition-colors">Fundador, Careful Baza Labs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pilares da Marca */}
      <div className="bg-white dark:bg-gray-900 py-12 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <span className="text-baza-mint font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Nossos Pilares</span>
            <h2 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors">O Padrão Baza de Qualidade.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-baza-lavender/5 dark:bg-baza-lavender/10 text-baza-lavender dark:text-baza-mint rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Segurança e Transparência</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">Você sabe exatamente o que está comprando. Nosso ambiente de pagamento possui criptografia de ponta a ponta e seus dados estão 100% blindados.</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-baza-lavender/5 dark:bg-baza-lavender/10 text-baza-lavender dark:text-baza-mint rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </div>
              <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Fórmulas Biocompatíveis</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">Não testamos em animais. Formulamos apenas com ativos limpos, livres de toxinas, que a sua pele reconhece e absorve com máxima eficiência.</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-baza-lavender/5 dark:bg-baza-lavender/10 text-baza-lavender dark:text-baza-mint rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Logística de Ponta</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">Da nossa curadoria direto para a sua casa. Processamento rápido de pedidos e rastreamento em tempo real para você acompanhar cada passo da entrega.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}