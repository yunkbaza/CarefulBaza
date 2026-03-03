import { useRef, useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ProductGrid() {
  const sliderRef = useRef(null);
  const { addToCart } = useCart();
  
  // 1. Estados para guardar os produtos do banco de dados
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Busca os dados na sua API quando a página carrega
  useEffect(() => {
    // Tenta usar a variável da nuvem, se não houver, usa o localhost (seu PC)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos da API:", err);
        setLoading(false);
      });
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Rotina de Alta Performance</h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm uppercase font-bold tracking-widest transition-colors duration-300">Selecione o seu tratamento</p>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => scroll('left')} aria-label="Anterior" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-300 hover:border-baza-lavender hover:text-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint hover:bg-baza-lavender/5 dark:hover:bg-baza-lavender/10 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => scroll('right')} aria-label="Próximo" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-300 hover:border-baza-lavender hover:text-baza-lavender dark:hover:text-baza-mint dark:hover:border-baza-mint hover:bg-baza-lavender/5 dark:hover:bg-baza-lavender/10 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* 3. Mostra um ícone a rodar enquanto busca na base de dados */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-800 border-t-baza-lavender dark:border-t-baza-mint rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Nenhum produto encontrado na base de dados.</div>
      ) : (
        <div ref={sliderRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-8 -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {products.map((product) => (
            <Link 
              to={`/produto/${product.id}`} 
              key={product.id} 
              className="group flex flex-col min-w-[200px] w-[200px] md:min-w-[240px] md:w-[240px] flex-shrink-0"
            >
              <div className="relative aspect-[4/5] bg-gray-50 dark:bg-gray-800 overflow-hidden mb-5 rounded-sm transition-colors duration-300">
                
                {/* Calcula a percentagem de desconto automaticamente! */}
                {product.compareAtPrice && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest shadow-sm rounded-sm">
                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </div>
                )}
                
                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105" />

                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); 
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 rounded-sm"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold transition-colors duration-300">
                    {product.category?.name || 'Skincare'}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 text-baza-lavender dark:text-baza-mint fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400 transition-colors duration-300">(5.0)</span>
                  </div>
                </div>
                <h3 className="font-syne font-bold text-gray-900 dark:text-white text-base mb-1 line-clamp-1 group-hover:text-baza-lavender dark:group-hover:text-baza-mint transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="mt-auto flex items-center gap-2">
                  {/* Se tiver preço antigo, ele aparece riscado aqui */}
                  {product.compareAtPrice && (
                    <span className="text-xs font-mono line-through text-gray-400">
                      R$ {Number(product.compareAtPrice).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-300 transition-colors duration-300">
                    R$ {Number(product.price).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}