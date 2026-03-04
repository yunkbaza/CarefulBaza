import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const { convertAndFormat } = useCurrency();
  
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
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-baza-lavender rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center">{t('product_ui.not_found')}</div>;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-32 px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* GALERIA */}
        <div className="aspect-[4/5] bg-gray-50 dark:bg-gray-800 rounded-sm overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
        </div>

        {/* INFO */}
        <div className="flex flex-col justify-center">
          <span className="text-baza-lavender dark:text-baza-mint font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
            Careful Baza Labs • {product.category?.name}
          </span>
          <h1 className="font-syne text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col">
              {product.compareAtPrice && (
                <span className="text-sm font-mono line-through text-gray-400">
                  {convertAndFormat(product.compareAtPrice)}
                </span>
              )}
              <span className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
                {convertAndFormat(product.price)}
              </span>
            </div>
            <span className="bg-baza-mint/10 text-baza-mint px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
              {t('product_ui.offer')}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10 text-lg">
            {product.description || t('shop.descriptions.category')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all shadow-xl"
            >
              {t('product_ui.add_btn')}
            </button>
          </div>

          {/* SELOS DE PUREZA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center sm:text-left">
              <span className="block text-[10px] font-bold text-gray-900 dark:text-white uppercase mb-1">{t('product_ui.paraben_free')}</span>
              <p className="text-[10px] text-gray-400 uppercase">{t('product_ui.purity')}</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="block text-[10px] font-bold text-gray-900 dark:text-white uppercase mb-1">{t('product_ui.cruelty_free')}</span>
              <p className="text-[10px] text-gray-400 uppercase">100% Vegan</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="block text-[10px] font-bold text-gray-900 dark:text-white uppercase mb-1">{t('product_ui.tested')}</span>
              <p className="text-[10px] text-gray-400 uppercase">Careful Baza Labs</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}