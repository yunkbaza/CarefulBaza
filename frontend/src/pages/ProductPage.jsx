import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('howToUse');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">{t('product_ui.loading')}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">{t('product_ui.not_found')}</div>;

  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full lg:w-1/2 bg-gray-50 dark:bg-black flex items-center justify-center min-h-[50vh] p-8 lg:p-20 transition-colors duration-300">
        <img src={product.image} alt={product.name} className="w-full max-w-lg object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-700" />
      </div>

      <div className="w-full lg:w-1/2 px-8 py-16 md:px-16 lg:px-24 flex flex-col justify-center">
        <div className="max-w-xl mx-auto lg:mx-0 w-full">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint mb-10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t('shop.view_all')}
          </Link>
          
          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-bold block mb-4">
            {product.category?.name || 'Treatment'}
          </span>
          
          <h1 className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            {product.compareAtPrice && (
              <span className="text-xl font-mono line-through text-gray-400 dark:text-gray-600">
                ${Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
            <span className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-200">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-12 text-base text-justify">{product.description}</p>

          <button onClick={() => addToCart(product)} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 text-xs font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all duration-300 shadow-2xl mb-12 flex items-center justify-center gap-3">
            {t('product_ui.add_btn')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>

          <div className="border-t border-gray-200 dark:border-gray-800 transition-colors">
            <button onClick={() => setActiveTab(activeTab === 'howToUse' ? '' : 'howToUse')} className="w-full py-6 flex justify-between items-center text-left group">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 dark:text-gray-200 group-hover:text-baza-lavender dark:group-hover:text-baza-mint">{t('product_ui.how_to_use')}</span>
              <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeTab === 'howToUse' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTab === 'howToUse' ? 'max-h-96 pb-8' : 'max-h-0'}`}>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-l-2 border-baza-lavender dark:border-baza-mint">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{product.howToUse || 'Apply on clean skin and massage gently until fully absorbed.'}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-b border-gray-200 dark:border-gray-800 transition-colors">
            <button onClick={() => setActiveTab(activeTab === 'ingredients' ? '' : 'ingredients')} className="w-full py-6 flex justify-between items-center text-left group">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 dark:text-gray-200 group-hover:text-baza-lavender dark:group-hover:text-baza-mint">{t('product_ui.purity')}</span>
              <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeTab === 'ingredients' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTab === 'ingredients' ? 'max-h-96 pb-8' : 'max-h-0'}`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{t('product_ui.purity_desc')}</p>
              <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-2">
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-baza-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('product_ui.paraben_free')}</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-baza-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('product_ui.cruelty_free')}</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-baza-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('product_ui.tested')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}