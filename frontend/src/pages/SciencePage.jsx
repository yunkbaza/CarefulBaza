import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function SciencePage() {
  const { topicId } = useParams();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(data => setDbProducts(data))
      .catch(err => console.error("Error loading products:", err));
  }, []);

  // Mapeamento para saber quais secções exibir em cada tópico e qual produto recomendar
  const TOPIC_STRUCTURE = {
    'tipos-de-pele': [
      { id: 'oleosa', product: 'Espuma de Limpeza Purificante' },
      { id: 'seca', product: 'Hidratante Aqua Glow' },
      { id: 'sensivel', product: 'Bruma Calmante Revitalizante' }
    ],
    'ativos': [
      { id: 'niacinamida', product: 'Sérum Renovador Niacinamida' },
      { id: 'retinol', product: 'Essência Noturna Retinol' }
    ],
    'tipos-de-cabelo': [
      { id: 'poroso', product: 'Óleo Reparador Botânico' },
      { id: 'fino', product: 'Bruma Calmante Revitalizante' }
    ],
    'dicas': [
      { id: 'matinal', product: 'Sérum Renovador Niacinamida' },
      { id: 'noturna', product: 'Hidratante Aqua Glow' }
    ]
  };

  const sections = TOPIC_STRUCTURE[topicId] || [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 pb-32 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t('science.back')}
        </Link>
        
        <span className="text-baza-mint font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Careful Baza Labs</span>
        
        <h1 className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {t(`science.topics.${topicId}.title`, t('science.default_title'))}
        </h1>
        <h2 className="text-xl md:text-2xl text-baza-lavender dark:text-baza-mint font-serif italic mb-10">
          {t(`science.topics.${topicId}.subtitle`, t('science.default_subtitle'))}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-16 max-w-2xl">
          {t(`science.topics.${topicId}.intro`, t('science.default_intro'))}
        </p>

        <div className="flex flex-col gap-24">
          {sections.map((sec) => {
            const realProduct = dbProducts.find(p => p.name === sec.product);

            return (
              <div key={sec.id} className="scroll-mt-32 border-t border-gray-100 dark:border-gray-800 pt-12" id={sec.id}>
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-7/12">
                    <h3 className="font-syne text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      {t(`science.topics.${topicId}.sections.${sec.id}.title`)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-lg">
                      {t(`science.topics.${topicId}.sections.${sec.id}.body`)}
                    </p>
                    
                    <div className="bg-baza-lavender/5 dark:bg-baza-lavender/10 border-l-2 border-baza-lavender p-6 mb-8">
                      <div className="flex items-center gap-2 mb-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-baza-lavender"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-baza-lavender dark:text-baza-mint">{t('science.golden_tip')}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                        {t(`science.topics.${topicId}.sections.${sec.id}.tip`)}
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-5/12">
                    {realProduct && (
                      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-sm sticky top-32">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-24 h-24 flex-shrink-0 bg-white dark:bg-gray-900 rounded-sm overflow-hidden border border-gray-100 dark:border-gray-800 p-2">
                            <img src={realProduct.image} alt={realProduct.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block mb-1">{t('science.solution_title')}</span>
                            <h4 className="font-syne text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{realProduct.name}</h4>
                            <span className="text-[10px] text-baza-lavender font-bold uppercase tracking-widest block">{realProduct.category?.name || 'Treatment'}</span>
                          </div>
                        </div>

                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2 block">{t('science.why_works')}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {t(`science.topics.${topicId}.sections.${sec.id}.why`)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-col">
                            {realProduct.compareAtPrice && <span className="text-xs font-mono line-through text-gray-400">${realProduct.compareAtPrice.toFixed(2)}</span>}
                            <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">${realProduct.price.toFixed(2)}</span>
                          </div>
                          <button 
                            onClick={() => addToCart(realProduct)}
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors shadow-md"
                          >
                            {t('science.add_btn')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}