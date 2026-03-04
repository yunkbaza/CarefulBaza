import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LegalPage() {
  const { pageId } = useParams();
  const { t } = useTranslation();

  // Função auxiliar para renderizar as secções baseadas no ID da página
  const renderSections = () => {
    // Definimos quantas secções cada página tem para mapear no JSON
    const sectionCounts = {
      'faq': [1, 2, 3],
      'trocas': [1, 2, 3],
      'termos': [1, 2],
      'privacidade': [1, 2]
    };

    const currentSections = sectionCounts[pageId] || sectionCounts['faq'];

    return currentSections.map((num) => (
      <div key={num} className="border-b border-gray-100 dark:border-gray-800 pb-8">
        <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t(`legal.${pageId}.h${num}`)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
          {t(`legal.${pageId}.t${num}`)}
        </p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 pb-32 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t('legal.back_home')}
        </Link>
        
        <h1 className="font-syne text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t(`legal.${pageId}.title`)}
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-16">
          {t(`legal.${pageId}.subtitle`)}
        </p>

        <div className="space-y-12">
          {renderSections()}
        </div>

      </div>
    </div>
  );
}