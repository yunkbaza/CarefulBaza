import Hero from '../components/Hero';
import AuthorityBar from '../components/AuthorityBar';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  return (
    <>
      <Hero />
      <AuthorityBar />
      {/* Aqui entram as classes dark:bg-gray-900 e a transição suave */}
      <div className="bg-white dark:bg-gray-900 pt-24 pb-32 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <ProductGrid />
      </div>
    </>
  );
}