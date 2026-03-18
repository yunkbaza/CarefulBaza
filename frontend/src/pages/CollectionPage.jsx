import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';

export default function CollectionPage() {
  const { categoryId } = useParams(); 
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation(); 
  const { convertAndFormat } = useCurrency();
  const [sortOrder, setSortOrder] = useState('relevance');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 📡 Ajustámos a URL para bater na rota correta do nosso backend Node.js
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(data => {
        // Simulamos avaliações (reviews) para os produtos importados do AliExpress
        const dataWithReviews = data.map(p => ({
          ...p,
          reviews: Math.floor(Math.random() * 200) + 15
        }));
        setProducts(dataWithReviews);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar catálogo:", err);
        setLoading(false);
      });
  }, []);

  const processedProducts = useMemo(() => {
    let filtered = [...products];
    if (categoryId && categoryId !== 'mais-vendidos') {
      filtered = filtered.filter(p => p.category?.name.toLowerCase().replace(/ /g, '-') === categoryId.toLowerCase());
    } else if (categoryId === 'mais-vendidos') {
      filtered = filtered.filter(p => p.reviews > 100);
    }

    if (sortOrder === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => b.reviews - a.reviews);
    }
    return filtered;
  }, [products, categoryId, sortOrder]);

  const pageTitle = categoryId ? t(`shop.titles.${categoryId}`, categoryId.replace('-', ' ')) : t('shop.titles.all');
  const pageDescription = categoryId && categoryId !== 'mais-vendidos' 
    ? t('shop.descriptions.category')
    : t('shop.descriptions.all');

  // Função auxiliar para depurar as traduções dos produtos
  const getTranslatedName = (productName) => {
    if (!productName) return '';
    const translated = t(`products.${productName}`, { defaultValue: 'NOT_FOUND' });
    if (translated === 'NOT_FOUND' && i18n.language !== 'pt') {
      return productName; // Retorna o nome original do AliExpress se não houver tradução
    }
    return translated === 'NOT_FOUND' ? productName : translated;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-10 pb-24 px-6 md:px-16">
      
      <div className="max-w-7xl mx-auto mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t('shop.breadcrumb')}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="font-syne text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 capitalize">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {pageDescription}
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {t('shop.found', { count: processedProducts.length })}
        </span>
        
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300">{t('shop.sort_by')}</span>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-transparent border-none outline-none cursor-pointer hover:text-baza-lavender dark:hover:text-baza-mint transition-colors"
          >
            <option value="relevance" className="dark:bg-gray-900">{t('shop.relevance')}</option>
            <option value="price-low" className="dark:bg-gray-900">{t('shop.price_low')}</option>
            <option value="price-high" className="dark:bg-gray-900">{t('shop.price_high')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <div className="w-12 h-12 border-4 border-gray-100 dark:border-gray-800 border-t-baza-lavender rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {processedProducts.map((product) => (
            <Link to={`/produto/${product.id}`} key={product.id} className="group flex flex-col">
              <div className="relative aspect-[4/5] bg-gray-50 dark:bg-gray-800 overflow-hidden mb-5 rounded-sm">
                
                {product.compareAtPrice && (
                  <div className="absolute top-3 left-3 z-10 bg-baza-mint text-baza-lavender px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest shadow-sm rounded-sm">
                    {t('shop.promo')}
                  </div>
                )}
                
                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105" />
                
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-colors duration-300 rounded-sm flex items-center justify-center gap-2 shadow-xl"
                  >
                    {t('shop.add_btn')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">{product.category?.name || 'Geral'}</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 text-baza-lavender dark:text-baza-mint fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="text-[9px] font-mono text-gray-500">({product.reviews})</span>
                  </div>
                </div>
                
                <h3 className="font-syne font-bold text-gray-900 dark:text-white text-base mb-2 group-hover:text-baza-lavender dark:group-hover:text-baza-mint transition-colors line-clamp-1">
                  {getTranslatedName(product.name)}
                </h3>
                
                <div className="mt-auto flex flex-col gap-0.5">
                  {product.compareAtPrice && (
                    <span className="text-xs font-mono line-through text-gray-400">
                      {convertAndFormat(product.compareAtPrice)}
                    </span>
                  )}
                  <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-300">
                    {convertAndFormat(product.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && processedProducts.length === 0 && (
        <div className="text-center py-24 flex flex-col items-center">
          <svg className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <h3 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('shop.empty_title')}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{t('shop.empty_desc')}</p>
          <Link to="/" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors">
            {t('shop.view_all')}
          </Link>
        </div>
      )}
    </div>
  );
}