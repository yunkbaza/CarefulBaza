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

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  // Lógica em tempo real (Sem useEffect)
  const results = query.length > 1
    ? SEARCH_DB.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // A forma correta e mais rápida de limpar os dados: No momento do clique!
  const handleClose = () => {
    setQuery(''); // Limpa o texto
    onClose();    // Fecha a janela avisando o App.jsx
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300 animate-in fade-in slide-in-from-top-4">
      
      <div className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex-1 flex items-center gap-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que sua pele precisa hoje?" 
            className="w-full bg-transparent border-none outline-none font-syne text-xl md:text-3xl text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700"
          />
        </div>
        {/* Usamos o handleClose aqui no botão de fechar (X) */}
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ml-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-16 py-10">
        <div className="max-w-4xl mx-auto">
          
          {query.length < 2 && (
            <div className="text-center mt-20">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Sugestões de Busca</span>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => setQuery('Sérum')} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 rounded-sm hover:bg-baza-lavender hover:text-white transition-colors">Séruns</button>
                <button onClick={() => setQuery('Hidratante')} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 rounded-sm hover:bg-baza-lavender hover:text-white transition-colors">Hidratantes</button>
                <button onClick={() => setQuery('Retinol')} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 rounded-sm hover:bg-baza-lavender hover:text-white transition-colors">Retinol</button>
              </div>
            </div>
          )}

          {query.length > 1 && results.length === 0 && (
            <div className="text-center mt-20">
              <p className="text-xl font-syne text-gray-900 dark:text-white mb-2">Nenhum produto encontrado para "{query}"</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Tente buscar por categorias como "Skincare" ou "Kits".</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {results.map((product) => (
              <Link 
                key={product.id} 
                to={`/produto/${product.id}`} 
                onClick={handleClose} // E usamos o handleClose aqui quando ele clica no produto
                className="group flex flex-col gap-4"
              >
                <div className="aspect-[4/5] bg-gray-50 dark:bg-gray-800 overflow-hidden rounded-sm">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block mb-1">{product.category}</span>
                  <h3 className="font-syne font-bold text-gray-900 dark:text-white text-base group-hover:text-baza-lavender transition-colors">{product.name}</h3>
                  <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-300 mt-1 block">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}