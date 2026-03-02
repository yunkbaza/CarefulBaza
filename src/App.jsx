import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileMenu from './components/MobileMenu';
import Quiz from './components/Quiz';
import SearchModal from './components/SearchModal'; 

// Importação das Páginas
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CollectionPage from './pages/CollectionPage';
import AboutPage from './pages/AboutPage';
import SciencePage from './pages/SciencePage';
import TrackPage from './pages/TrackPage';
import LegalPage from './pages/LegalPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MainLayout() {
  const { isCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen || isQuizOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, isMobileMenuOpen, isQuizOpen, isSearchOpen]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-gray-900 transition-colors duration-300 selection:bg-baza-mint selection:text-gray-900 relative">
        
        <CartDrawer />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <Quiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        
        <AnnouncementBar />
        <Navbar 
          onOpenMenu={() => setIsMobileMenuOpen(true)} 
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isDarkMode={isDarkMode}
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
            <Route path="/info/:pageId" element={<LegalPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
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