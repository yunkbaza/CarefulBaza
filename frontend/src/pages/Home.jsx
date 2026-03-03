import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import AuthorityBar from '../components/AuthorityBar';
import ProductCarousel from '../components/ProductCarousel';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os produtos REAIS na API para alimentar o Carrossel Infinito
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar produtos na Home:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <Hero />
      <AuthorityBar />
      
      {/* Aqui entram as classes dark e a transição suave que você já tinha */}
      <div className="pt-24 pb-32 border-t border-gray-100 dark:border-gray-800">
        {loading ? (
          <div className="py-32 flex justify-center">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-baza-lavender dark:border-t-baza-mint rounded-full animate-spin"></div>
          </div>
        ) : (
          <ProductCarousel 
            products={products} 
            title="Alta Performance" 
            subtitle="Descubra a Coleção" 
          />
        )}
      </div>
    </main>
  );
}