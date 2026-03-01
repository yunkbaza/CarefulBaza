import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileMenu from './components/MobileMenu';
import Quiz from './components/Quiz';

import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CollectionPage from './pages/CollectionPage';
import AboutPage from './pages/AboutPage';
import SciencePage from './pages/SciencePage';
import TrackPage from './pages/TrackPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MainLayout() {
  const { isCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen || isQuizOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, isMobileMenuOpen, isQuizOpen]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-baza-mint selection:text-gray-900 relative">
        
        <CartDrawer />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <Quiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
        
        <AnnouncementBar />
        <Navbar 
          onOpenMenu={() => setIsMobileMenuOpen(true)} 
          onOpenQuiz={() => setIsQuizOpen(true)}
        />
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/shop" element={<CollectionPage />} />
            <Route path="/colecao/:categoryId" element={<CollectionPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/ciencia/:topicId" element={<SciencePage />} />
            <Route path="/rastreio" element={<TrackPage />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}