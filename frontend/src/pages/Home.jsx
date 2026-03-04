import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Importar o hook de tradução
import Hero from '../components/Hero';
import AuthorityBar from '../components/AuthorityBar';
import ProductCarousel from '../components/ProductCarousel';

export default function Home() {
  const { t } = useTranslation(); // Inicializar a função de tradução
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
      
      <div className="pt-24 pb-32 border-t border-gray-100 dark:border-gray-800">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-baza-lavender dark:border-t-baza-mint rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {t('home.loading')}
            </p>
          </div>
        ) : (
          <ProductCarousel 
            products={products} 
            title={t('home.carousel_title')} 
            subtitle={t('home.carousel_subtitle')} 
          />
        )}
      </div>
    </main>
  );
}