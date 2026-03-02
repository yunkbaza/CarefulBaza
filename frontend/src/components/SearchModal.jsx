import { useState } from 'react';
import { Link } from 'react-router-dom';

const SEARCH_DB = [
  { id: 1, name: 'Sérum Renovador Niacinamida', category: 'skincare', price: 189.90, image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbce5ce?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Hidratante Aqua Glow', category: 'skincare', price: 145.00, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Óleo Reparador Botânico', category: 'banho-corpo', price: 210.00, image: 'https://images.unsplash.com/photo-1615397323861-125026210f84?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Essência Noturna Retinol', category: 'skincare', price: 250.00, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: 'Bruma Calmante Revitalizante', category: 'skincare', price: 110.00, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop' },
  { id: 7, name: 'Perfume Sólido Amadeirado', category: 'fragrancias', price: 195.00, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop' },
  { id: 8, name: 'Kit Viagem Essencial', category: 'kits', price: 320.00, image: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?q=80&w=600&auto=format&fit=crop' },
];

const CATEGORIES = [
  { name: 'Skincare', slug: 'skincare', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100' },
  { name: 'Corpo', slug: 'banho-corpo', img: 'https://images.unsplash.com/photo-1615397323861-125026210f84?w=100' },
  { name: 'Kits', slug: 'kits', img: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?w=100' },
  { id: 7, name: 'Fragrâncias', slug: 'fragrancias', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100' },
];

// --- MOTOR DE BUSCA INTELIGENTE ---

// 1. Remove acentos e converte para minúsculo
const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// 2. Calcula a "distância" entre duas palavras (quantas letras erradas existem)
const levenshtein = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, () => []);
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

// 3. A lógica que decide se o produto aparece ou não
const smartSearch = (query, product) => {
  const q = normalize(query);
  const name = normalize(product.name);
  const cat = normalize(product.category);

  // Match perfeito ou parcial (ex: digitar "serum" acha "sérum" sem usar matemática pesada)
  if (name.includes(q) || cat.includes(q)) return true;

  // Busca permissiva para erros de digitação (ex: "serun" ou "hidrtante")
  if (q.length > 3) {
    const words = name.split(' ').concat(cat.split('-'));
    for (const word of words) {
      // Permite até 2 erros para palavras longas, 1 erro para curtas
      const maxDistance = q.length > 5 ? 2 : 1;
      
      if (Math.abs(word.length - q.length) <= maxDistance) {
        if (levenshtein(q, word) <= maxDistance) return true;
      } else if (word.length > q.length) {
        // Checa se a pessoa estava digitando certo, mas errou uma letra no meio
        if (levenshtein(q, word.substring(0, q.length)) <= maxDistance) return true;
      }
    }
  }
  return false;
};

// --- FIM DO MOTOR DE BUSCA ---

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  // Agora usamos a função `smartSearch` ao invés do includes básico
  const results = query.length > 1
    ? SEARCH_DB.filter(product => smartSearch(query, product))
    : [];

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-gray-900 transition-colors duration-500 animate-in fade-in slide-in-from-top-6">
      
      {/* HEADER DE BUSCA */}
      <div className="flex items-center justify-between px-6 md:px-16 py-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex-1 flex items-center gap-6 max-w-5xl mx-auto w-full">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-baza-lavender dark:text-baza-mint"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que sua pele precisa hoje?" 
            className="w-full bg-transparent border-none outline-none font-syne text-2xl md:text-4xl text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700"
          />
        </div>
        <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:rotate-90">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-16 py-12 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          
          {/* TELA INICIAL (QUANDO NÃO HÁ BUSCA) */}
          {query.length < 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* CATEGORIAS RÁPIDAS */}
              <div className="mb-16">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 block mb-8">Navegar por Categoria</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.slug} 
                      to={`/colecao/${cat.slug}`} 
                      onClick={handleClose}
                      className="group flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-baza-lavender dark:hover:border-baza-mint transition-all rounded-sm"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-syne font-bold text-gray-900 dark:text-white text-sm">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* BUSCAS POPULARES */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 block mb-6">Buscas Populares</span>
                <div className="flex flex-wrap gap-3">
                  {['Niacinamida', 'Retinol', 'Kit Presente', 'Pele Oleosa', 'Best Sellers'].map((item) => (
                    <button 
                      key={item} 
                      onClick={() => setQuery(item)}
                      className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white dark:hover:text-black hover:border-baza-lavender dark:hover:border-baza-mint transition-all rounded-full"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* RESULTADOS DA BUSCA */}
          {query.length > 1 && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-end mb-10 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white">
                  Resultados para <span className="text-baza-lavender dark:text-baza-mint italic">"{query}"</span>
                </h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{results.length} itens encontrados</span>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 dark:text-gray-500 mb-4 italic">Nenhum produto corresponde à sua busca.</p>
                  <button onClick={() => setQuery('')} className="text-baza-lavender dark:text-baza-mint font-bold text-xs uppercase tracking-widest border-b border-baza-lavender dark:border-baza-mint pb-1">Ver todos os produtos</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/produto/${product.id}`} 
                      onClick={handleClose}
                      className="group flex gap-5 p-4 bg-white dark:bg-gray-800 border border-gray-50 dark:border-gray-700 hover:shadow-xl hover:shadow-baza-lavender/5 transition-all"
                    >
                      <div className="w-24 h-28 bg-gray-50 dark:bg-gray-900 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[9px] text-baza-lavender dark:text-baza-mint uppercase tracking-widest font-extrabold mb-1">{product.category}</span>
                        <h4 className="font-syne font-bold text-gray-900 dark:text-white text-base leading-tight mb-2 group-hover:text-baza-lavender dark:group-hover:text-baza-mint transition-colors">{product.name}</h4>
                        <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-300">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}