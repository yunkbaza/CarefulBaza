import { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuthorityBar from './components/AuthorityBar';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileMenu from './components/MobileMenu'; // IMPORTAMOS AQUI

function MainLayout() {
  const { isCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Trava o scroll do fundo se QUALQUER UM dos dois estiver aberto
  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, isMobileMenuOpen]);

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-baza-mint selection:text-gray-900 scroll-smooth relative">
      <CartDrawer />
      
      {/* Colocamos o Mobile Menu aqui! */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <AnnouncementBar />
      
      <Navbar onOpenMenu={() => setIsMobileMenuOpen(true)} />
      
      <Hero />
      <AuthorityBar />
      
      <div className="bg-white pt-24 pb-32 border-t border-gray-100">
        <ProductGrid />
      </div>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}