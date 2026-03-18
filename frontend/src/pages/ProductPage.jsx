import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [activeImage, setActiveImage] = useState(''); // Estado para a foto em destaque

  useEffect(() => {
    // 📡 Rota corrigida para bater no prefixo /api que definimos no backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    fetch(`${apiUrl}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setActiveImage(data.image); // Define a foto principal como a primeira a aparecer
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar produto:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-baza-lavender rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <p className="text-zinc-500 font-syne text-xl">{t('product_ui.not_found')}</p>
      <Link to="/shop" className="bg-zinc-900 text-white px-8 py-3 uppercase text-[10px] font-bold tracking-widest">
        Voltar à Loja
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-32 px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* COLUNA DA ESQUERDA: GALERIA DINÂMICA */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/5] bg-zinc-50 dark:bg-zinc-800 rounded-sm overflow-hidden border border-zinc-100 dark:border-zinc-800">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-700" 
            />
          </div>
          
          {/* Miniaturas da Galeria (se existirem) */}
          {product.gallery && product.gallery.length > 0 && (
            <div className="grid grid-cols-5 gap-3">
              {[product.image, ...product.gallery].slice(0, 5).map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-sm overflow-hidden border-2 transition-all 
                    ${activeImage === img ? 'border-baza-lavender dark:border-baza-mint' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA DA DIREITA: INFO */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-baza-lavender dark:text-baza-mint font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">
              Careful Baza Labs • {product.category?.name || 'Skincare'}
            </span>
            <h1 className="font-syne text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex flex-col">
                {product.compareAtPrice && (
                  <span className="text-sm font-mono line-through text-gray-400">
                    {convertAndFormat(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-3xl font-mono font-bold text-zinc-900 dark:text-white">
                  {convertAndFormat(product.price)}
                </span>
              </div>
              <div className="bg-baza-mint/10 text-baza-mint px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-baza-mint/20">
                {t('product_ui.offer')}
              </div>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none mb-10">
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
              {product.description || 'Uma formulação exclusiva desenhada para resultados reais e duradouros.'}
            </p>
          </div>

          <button 
            onClick={() => addToCart(product)}
            className="w-full sm:w-2/3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all shadow-xl rounded-sm flex items-center justify-center gap-3"
          >
            {t('product_ui.add_btn')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>

          {/* BENEFÍCIOS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-12 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">{t('product_ui.paraben_free')}</span>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Pureza Garantida</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">{t('product_ui.cruelty_free')}</span>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">100% Vegan</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">{t('product_ui.tested')}</span>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Clinicamente Provado</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}