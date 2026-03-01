import Hero from '../components/Hero';
import AuthorityBar from '../components/AuthorityBar';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  return (
    <>
      <Hero />
      <AuthorityBar />
      <div className="bg-white pt-24 pb-32 border-t border-gray-100">
        <ProductGrid />
      </div>
    </>
  );
}