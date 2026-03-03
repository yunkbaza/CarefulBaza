import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCarousel({ products, title, subtitle }) {
  const { addToCart } = useCart();
  const carouselRef = useRef(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Truque do Infinito: Triplicamos a lista
  const extendedProducts = products?.length > 0 ? [...products, ...products, ...products] : [];

  useEffect(() => {
    if (carouselRef.current && products?.length > 0) {
      setTimeout(() => {
        if (carouselRef.current) {
          const scrollWidth = carouselRef.current.scrollWidth;
          carouselRef.current.scrollLeft = scrollWidth / 3;
        }
      }, 100);
    }
  }, [products]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const oneThird = scrollWidth / 3;

    if (scrollLeft === 0) {
      carouselRef.current.style.scrollBehavior = 'auto';
      carouselRef.current.scrollLeft = oneThird;
    } 
    else if (scrollLeft + clientWidth >= scrollWidth - 10) {
      carouselRef.current.style.scrollBehavior = 'auto';
      carouselRef.current.scrollLeft = scrollLeft - oneThird;
    }
  };

  const startDrag = (e) => {
    setIsDragging(true);
    carouselRef.current.style.scrollBehavior = 'auto';
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const doDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'smooth';
      const walk = carouselRef.current.clientWidth * 0.6;
      carouselRef.current.scrollLeft += direction === 'left' ? -walk : walk;
    }
  };

  if (!products || products.length === 0) return null;

  return (
    // REMOVIDO: o py-24 daqui para acabar com o espaço gigante em baixo
    <section className="relative overflow-hidden bg-transparent transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-6 md:px-16 mb-8 flex justify-between items-end">
        <div>
          {subtitle && <span className="text-baza-mint font-bold uppercase tracking-widest text-[10px] mb-4 block">{subtitle}</span>}
          <h2 className="font-syne text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
        </div>
      </div>

      {/* AQUI ESTÁ O SEGREDO: Usamos group/carousel para as setas não interferirem nos produtos! */}
      <div className="relative group/carousel">
        
        {/* BOTÃO ESQUERDO (Ajustado com group-hover/carousel) */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-4 md:left-8 top-[40%] -translate-y-1/2 z-20 w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-900 dark:text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-xl hover:scale-110 hover:bg-white dark:hover:bg-gray-800"
          aria-label="Rolar para a esquerda"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseDown={startDrag}
          onMouseLeave={stopDrag}
          onMouseUp={stopDrag}
          onMouseMove={doDrag}
          onTouchStart={startDrag}
          onTouchEnd={stopDrag}
          onTouchMove={doDrag}
          className="flex overflow-x-auto gap-6 px-6 md:px-16 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {extendedProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="w-[280px] md:w-[320px] flex-shrink-0 snap-center select-none"
            >
              {/* O "group" padrão fica apenas no produto! O botão só sobe no Hover dele. */}
              <Link to={`/produto/${product.id}`} draggable="false" className="group flex flex-col h-full pointer-events-none">
                <div className="pointer-events-auto h-full flex flex-col">
                  
                  <div className="relative aspect-[4/5] bg-gray-50 dark:bg-gray-800 overflow-hidden mb-5 rounded-sm shadow-sm border border-gray-100 dark:border-gray-800">
                    
                    {product.compareAtPrice && (
                      <div className="absolute top-3 left-3 z-10 bg-baza-mint text-baza-lavender px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest shadow-sm rounded-sm">
                        OFERTA
                      </div>
                    )}
                    
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      draggable="false"
                      className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          if (!isDragging) addToCart(product); 
                        }}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-colors duration-300 rounded-sm shadow-xl"
                      >
                        Comprar Agora
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] text-baza-lavender dark:text-baza-mint uppercase tracking-widest font-bold mb-1.5">{product.category?.name || 'Careful Baza'}</span>
                    <h3 className="font-syne font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-baza-lavender dark:group-hover:text-baza-mint transition-colors line-clamp-1">{product.name}</h3>
                    
                    <div className="mt-auto flex items-center gap-2">
                      {product.compareAtPrice && (
                        <span className="text-sm font-mono line-through text-gray-400">R$ {product.compareAtPrice.toFixed(2).replace('.', ',')}</span>
                      )}
                      <span className="text-lg font-mono font-bold text-gray-900 dark:text-gray-200">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* BOTÃO DIREITO (Ajustado com group-hover/carousel) */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-4 md:right-8 top-[40%] -translate-y-1/2 z-20 w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-900 dark:text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-xl hover:scale-110 hover:bg-white dark:hover:bg-gray-800"
          aria-label="Rolar para a direita"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>

      </div>
    </section>
  );
}