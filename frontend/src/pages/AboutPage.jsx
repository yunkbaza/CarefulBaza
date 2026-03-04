import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="relative py-24 md:py-32 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gray-50 dark:bg-black/50 z-0"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="text-baza-mint font-bold uppercase tracking-[0.2em] text-[10px] mb-6 block">{t('about.hero_tag')}</span>
          <h1 className="font-syne text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">{t('about.hero_title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">{t('about.hero_desc')}</p>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800" alt="Laboratory" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{t('about.sec1_title')}</h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-400 text-sm md:text-base">
              <p>{t('about.sec1_p1')}</p>
              <p>{t('about.sec1_p2')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 px-6 md:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-16">{t('about.pillars_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Pillar title={t('about.pillar1_t')} desc={t('about.pillar1_d')} icon="source" />
            <Pillar title={t('about.pillar2_t')} desc={t('about.pillar2_d')} icon="check" />
            <Pillar title={t('about.pillar3_t')} desc={t('about.pillar3_d')} icon="luxury" />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 text-center max-w-4xl mx-auto">
        <h2 className="font-syne text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t('about.cta_title')}</h2>
        <Link to="/shop" className="inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-all shadow-xl">
          {t('about.cta_btn')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </section>
    </main>
  );
}

function Pillar({ title, desc }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-10 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}