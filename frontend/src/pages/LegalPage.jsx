import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LegalPage() {
  const { pageId } = useParams();
  const { t } = useTranslation();
  
  // Estado para controlar qual FAQ está aberto e qual foi a última página visitada
  const [openFaq, setOpenFaq] = useState(null);
  const [prevPageId, setPrevPageId] = useState(pageId);

  // 🛡️ CORREÇÃO DO ESLINT: O padrão oficial do React moderno!
  // Se a URL mudou, nós resetamos o estado instantaneamente ANTES do React desenhar a tela,
  // poupando memória e processamento.
  if (pageId !== prevPageId) {
    setPrevPageId(pageId);
    setOpenFaq(null);
  }

  // 🚀 MÁGICA 1: Busca Dinâmica de Secções
  const getSections = () => {
    const sections = [];
    for (let i = 1; i <= 15; i++) {
      const titleKey = `legal.${pageId}.h${i}`;
      const textKey = `legal.${pageId}.t${i}`;
      
      const title = t(titleKey);
      const text = t(textKey);

      if (title !== titleKey && text !== textKey) {
        sections.push({ id: i, title, text });
      }
    }
    
    if (sections.length === 0) {
      sections.push({
        id: 1,
        title: t('legal.not_found_title', 'Conteúdo em atualização'),
        text: t('legal.not_found_text', 'Estamos a atualizar esta secção. Por favor, volte em breve.')
      });
    }
    
    return sections;
  };

  const sections = getSections();
  const isFaq = pageId === 'faq';

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 transition-colors duration-300 pt-24 pb-32 px-5 sm:px-8 md:px-16">
      <div className="max-w-3xl mx-auto">
        
        {/* Botão de Voltar Responsivo */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-[#a79af0] dark:hover:text-[#dff3c8] transition-colors mb-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {t('legal.back_home', 'Voltar ao Início')}
        </Link>
        
        {/* Cabeçalho */}
        <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
          {t(`legal.${pageId}.title`)}
        </h1>
        <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 mb-12 sm:mb-16">
          {t(`legal.${pageId}.subtitle`)}
        </p>

        {/* 🚀 MÁGICA 2: Renderização Condicional (FAQ vs Texto Legal) */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className={`transition-all duration-300 ${
                isFaq 
                  ? 'border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden' 
                  : 'border-b border-zinc-100 dark:border-zinc-800/50 pb-8 last:border-0'
              }`}
            >
              {isFaq ? (
                <>
                  <button 
                    onClick={() => setOpenFaq(openFaq === section.id ? null : section.id)}
                    className="w-full text-left p-5 sm:p-6 flex justify-between items-center focus:outline-none cursor-pointer"
                  >
                    <h2 className="font-['Syne',sans-serif] text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 pr-4">
                      {section.title}
                    </h2>
                    <span className={`transform transition-transform duration-300 text-zinc-400 ${openFaq === section.id ? 'rotate-180' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  
                  <div 
                    className={`px-5 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === section.id ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {section.text}
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="font-['Syne',sans-serif] text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                    {section.text}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}