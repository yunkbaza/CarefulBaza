import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const PRODUCT_DATA = {
  name: 'Sérum Renovador',
  category: 'Skincare',
  price: 189.90,
  image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbce5ce?q=80&w=1000&auto=format&fit=crop',
  description: 'Uma fórmula limpa e de alta performance que acelera a renovação celular, revelando uma pele mais luminosa e uniforme desde a primeira aplicação. Nosso sérum best-seller age durante o dia e à noite para proteger e restaurar a barreira cutânea.',
  ingredients: 'Água Purificada, Niacinamida 10%, Ácido Hialurônico de Baixo Peso Molecular, Extrato Botânico de Chá Verde, Pantenol.',
  howToUse: 'Aplique 3 a 4 gotas no rosto limpo e seco pela manhã e à noite. Massageie com movimentos ascendentes até a completa absorção. Siga com seu hidratante Careful Baza favorito.'
};

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('description');
  const [showSticky, setShowSticky] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id: Number(id), ...PRODUCT_DATA });
  };

  // Lógica para mostrar o botão fixo no mobile ao rolar a tela
  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative pb-20 lg:pb-0">
      
      {/* Coluna da Imagem */}
      <div className="w-full lg:w-1/2 bg-gray-50 dark:bg-black transition-colors duration-300 flex items-center justify-center min-h-[50vh] lg:min-h-screen relative p-8">
        <div className="absolute top-6 left-6 z-10 bg-baza-mint text-baza-lavender px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm rounded-sm">
          Mais Vendido
        </div>
        <img 
          src={PRODUCT_DATA.image} 
          alt={PRODUCT_DATA.name} 
          className="w-full max-w-lg object-contain mix-blend-multiply dark:mix-blend-normal"
        />
      </div>

      {/* Coluna de Informações */}
      <div className="w-full lg:w-1/2 px-8 py-12 md:px-16 lg:py-24 flex flex-col justify-center">
        <div className="max-w-md mx-auto lg:mx-0 w-full">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors mb-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar para a vitrine
          </Link>
          
          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold block mb-4">
            {PRODUCT_DATA.category}
          </span>
          
          <h1 className="font-syne text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {PRODUCT_DATA.name}
          </h1>
          
          <span className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-200 block mb-8">
            R$ {PRODUCT_DATA.price.toFixed(2).replace('.', ',')}
          </span>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10 text-sm">
            {PRODUCT_DATA.description}
          </p>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 text-xs font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-lavender hover:text-white transition-all duration-300 shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 mb-12"
          >
            Adicionar à Sacola
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>

          {/* Acordeão de Detalhes */}
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <button onClick={() => setActiveTab(activeTab === 'ingredients' ? '' : 'ingredients')} className="w-full py-6 flex justify-between items-center text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-gray-200">Ingredientes Principais</span>
                <span className="text-xl font-light text-gray-400 dark:text-gray-500">{activeTab === 'ingredients' ? '-' : '+'}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'ingredients' ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{PRODUCT_DATA.ingredients}</p>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-800">
              <button onClick={() => setActiveTab(activeTab === 'howToUse' ? '' : 'howToUse')} className="w-full py-6 flex justify-between items-center text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-gray-200">Como Usar</span>
                <span className="text-xl font-light text-gray-400 dark:text-gray-500">{activeTab === 'howToUse' ? '-' : '+'}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'howToUse' ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{PRODUCT_DATA.howToUse}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STICKY ADD TO CART (Aparece no Mobile ao rolar a página) */}
      <div className={`fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-40 transform transition-transform duration-300 lg:hidden flex items-center justify-between gap-4 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex flex-col">
          <span className="font-syne font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{PRODUCT_DATA.name}</span>
          <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">R$ {PRODUCT_DATA.price.toFixed(2).replace('.', ',')}</span>
        </div>
        <button 
          onClick={handleAddToCart}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-lavender hover:text-white transition-colors whitespace-nowrap shadow-md"
        >
          Adicionar
        </button>
      </div>

    </main>
  );
}