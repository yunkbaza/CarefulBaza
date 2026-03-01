import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useMemo } from 'react';

// Banco de Dados Expandido da Loja (12 Produtos)
const ALL_PRODUCTS = [
  { id: 1, name: 'Sérum Renovador Niacinamida', category: 'skincare', price: 189.90, image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbce5ce?q=80&w=600&auto=format&fit=crop', tag: 'Mais Vendido', reviews: 128 },
  { id: 2, name: 'Hidratante Aqua Glow', category: 'skincare', price: 145.00, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop', tag: 'Novidade', reviews: 45 },
  { id: 3, name: 'Óleo Reparador Botânico', category: 'banho-corpo', price: 210.00, image: 'https://images.unsplash.com/photo-1615397323861-125026210f84?q=80&w=600&auto=format&fit=crop', tag: 'Tratamento', reviews: 89 },
  { id: 4, name: 'Essência Noturna Retinol', category: 'skincare', price: 250.00, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop', tag: 'Edição Limitada', reviews: 22 },
  { id: 5, name: 'Bruma Calmante Revitalizante', category: 'skincare', price: 110.00, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop', tag: null, reviews: 56 },
  { id: 6, name: 'Creme Iluminador para Olhos', category: 'skincare', price: 165.00, image: 'https://images.unsplash.com/photo-1571781926291-c477eb31f801?q=80&w=600&auto=format&fit=crop', tag: 'Destaque', reviews: 210 },
  { id: 7, name: 'Perfume Sólido Amadeirado', category: 'fragrancias', price: 195.00, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop', tag: 'Novo', reviews: 12 },
  { id: 8, name: 'Kit Viagem Essencial', category: 'kits', price: 320.00, image: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?q=80&w=600&auto=format&fit=crop', tag: 'Economia', reviews: 304 },
  { id: 9, name: 'Espuma de Limpeza Purificante', category: 'skincare', price: 89.90, image: 'https://images.unsplash.com/photo-1556228722-dca92acbe5fc?q=80&w=600&auto=format&fit=crop', tag: 'Uso Diário', reviews: 412 },
  { id: 10, name: 'Sérum Pós-Barba Calmante', category: 'masculino', price: 135.00, image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop', tag: null, reviews: 38 },
  { id: 11, name: 'Gel de Banho Energizante', category: 'banho-corpo', price: 75.00, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop', tag: null, reviews: 92 },
  { id: 12, name: 'Kit Rotina Completa 5 Passos', category: 'kits', price: 680.00, image: 'https://images.unsplash.com/photo-1615397323861-125026210f84?q=80&w=600&auto=format&fit=crop', tag: 'Frete Grátis', reviews: 156 },
];

export default function CollectionPage() {
  const { categoryId } = useParams(); 
  const { addToCart } = useCart();
  const [sortOrder, setSortOrder] = useState('relevance');

  // O Motor de Lógica: Filtra primeiro pela categoria, depois ordena os preços.
  const processedProducts = useMemo(() => {
    // 1. FILTRAR
    let filtered = [...ALL_PRODUCTS];
    if (categoryId && categoryId !== 'mais-vendidos') {
      filtered = filtered.filter(p => p.category === categoryId);
    } else if (categoryId === 'mais-vendidos') {
      filtered = filtered.filter(p => p.reviews > 100);
    }

    // 2. ORDENAR
    if (sortOrder === 'price-low') {
      filtered.sort((a, b) => a.price - b.price); // Do menor pro maior
    } else if (sortOrder === 'price-high') {
      filtered.sort((a, b) => b.price - a.price); // Do maior pro menor
    } else {
      // Relevância (Ordena por quem tem mais reviews)
      filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [categoryId, sortOrder]); // O useMemo garante que só rode a matemática quando essas coisas mudarem

  // Títulos dinâmicos com base na URL
  const titles = {
    'skincare': 'Skincare de Alta Performance',
    'fragrancias': 'Fragrâncias Exclusivas',
    'banho-corpo': 'Banho e Corpo',
    'masculino': 'Cuidados Masculinos',
    'kits': 'Kits e Presentes',
    'mais-vendidos': 'Os Mais Amados pelos Clientes',
  };
  
  const pageTitle = categoryId ? titles[categoryId] : 'Todos os Tratamentos';
  const pageDescription = categoryId && categoryId !== 'mais-vendidos' 
    ? `Descubra nossa seleção exclusiva para ${categoryId.replace('-', ' ')}. Fórmulas limpas e de eficácia comprovada.`
    : 'O catálogo completo da Careful Baza. Desenvolvido para entregar resultados reais respeitando a biologia da sua pele.';

  return (
    <div className="min-h-screen bg-white pt-10 pb-24 px-6 md:px-16">
      
      {/* Breadcrumb Elegante */}
      <div className="max-w-7xl mx-auto mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Página Inicial
        </Link>
      </div>

      {/* Cabeçalho da Coleção */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="font-syne text-4xl md:text-6xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {pageDescription}
        </p>
      </div>

      {/* Barra de Ferramentas (Filtros e Contagem) */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 pb-6 border-b border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {processedProducts.length} Produtos Encontrados
        </span>
        
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 border border-gray-100 rounded-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Ordenar por:</span>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-xs font-medium text-gray-600 bg-transparent border-none outline-none cursor-pointer hover:text-baza-lavender transition-colors"
          >
            <option value="relevance">Mais Relevantes</option>
            <option value="price-low">Menor Preço</option>
            <option value="price-high">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Grade de Produtos */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {processedProducts.map((product) => (
          <Link to={`/produto/${product.id}`} key={product.id} className="group flex flex-col">
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden mb-5 rounded-sm">
              
              {product.tag && (
                <div className="absolute top-3 left-3 z-10 bg-baza-mint text-baza-lavender px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest shadow-sm rounded-sm">
                  {product.tag}
                </div>
              )}
              
              <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
              
              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    addToCart(product); 
                  }}
                  className="w-full bg-gray-900 text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors duration-300 rounded-sm flex items-center justify-center gap-2 shadow-xl"
                >
                  Adicionar à Sacola
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">{product.category}</span>
                <div className="flex items-center gap-1">
                  <svg className="w-2.5 h-2.5 text-baza-lavender fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="text-[9px] font-mono text-gray-500">({product.reviews})</span>
                </div>
              </div>
              <h3 className="font-syne font-bold text-gray-900 text-base mb-2 group-hover:text-baza-lavender transition-colors">{product.name}</h3>
              <span className="text-sm font-mono font-bold text-gray-900 mt-auto">R$ {product.price.toFixed(2).replace('.', ',')}</span>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Estado Vazio (Caso clique em uma categoria sem produtos) */}
      {processedProducts.length === 0 && (
        <div className="text-center py-24 flex flex-col items-center">
          <svg className="w-16 h-16 text-gray-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <h3 className="font-syne text-2xl font-bold text-gray-900 mb-2">Coleção Esgotada</h3>
          <p className="text-gray-500 text-sm mb-8">Nossos especialistas estão preparando um novo lote de tratamentos para esta categoria.</p>
          <Link to="/shop" className="bg-gray-900 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors">
            Ver Todos os Produtos
          </Link>
        </div>
      )}
    </div>
  );
}