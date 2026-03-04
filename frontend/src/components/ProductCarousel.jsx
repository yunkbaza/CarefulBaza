import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

export default function ProductCarousel({ products, title, subtitle }) {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const extendedProducts = products?.length > 0 ? [...products, ...products, ...products] : [];

  useEffect(() => {
    if (carouselRef.current && products?.length > 0) {
      setTimeout(() => {
        if (carouselRef.current) carouselRef.current.scrollLeft = carouselRef.current.scrollWidth / 3;
      }, 100);
    }
  }, [products]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const oneThird = scrollWidth / 3;
    if (scrollLeft === 0) carouselRef.current.scrollLeft = oneThird;
    else if (scrollLeft + clientWidth >= scrollWidth - 10) carouselRef.current.scrollLeft = scrollLeft - oneThird;
  };

  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const stopDrag = () => setIsDragging(false);

  const doDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    carouselRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5;
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-16 mb-8 flex justify-between items-end">
        <div>
          {subtitle && <span className="text-baza-mint font-bold uppercase tracking-widest text-[10px] mb-4 block">{subtitle}</span>}
          <h2 className="font-syne text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
        </div>
      </div>

      <div className="relative group/carousel">
        <div ref={carouselRef} onScroll={handleScroll} onMouseDown={startDrag} onMouseLeave={stopDrag} onMouseUp={stopDrag} onMouseMove={doDrag} onTouchStart={startDrag} onTouchEnd={stopDrag} onTouchMove={doDrag} className="flex overflow-x-auto gap-6 px-6 md:px-16 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: 'none' }}>
          {extendedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="w-[280px] md:w-[320px] flex-shrink-0 snap-center select-none">
              <Link to={`/produto/${product.id}`} className="group flex flex-col h-full pointer-events-none">
                <div className="pointer-events-auto h-full flex flex-col">
                  <div className="relative aspect-[4/5] bg-gray-50 dark:bg-gray-800 overflow-hidden mb-5 rounded-sm border border-gray-100 dark:border-gray-800">
                    {product.compareAtPrice && (
                      <div className="absolute top-3 left-3 z-10 bg-baza-mint text-baza-lavender px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest rounded-sm">{t('product_ui.offer')}</div>
                    )}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isDragging) addToCart(product); }} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors duration-300 rounded-sm shadow-xl">{t('product_ui.buy_now')}</button>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] text-baza-lavender dark:text-baza-mint uppercase tracking-widest font-bold mb-1.5">{product.category?.name || 'Careful Baza'}</span>
                    <h3 className="font-syne font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-baza-lavender transition-colors line-clamp-1">{product.name}</h3>
                    <div className="mt-auto flex items-center gap-2">
                      {product.compareAtPrice && <span className="text-sm font-mono line-through text-gray-400">${Number(product.compareAtPrice).toFixed(2)}</span>}
                      <span className="text-lg font-mono font-bold text-gray-900 dark:text-gray-200">${Number(product.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}