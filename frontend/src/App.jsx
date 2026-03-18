import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { useTranslation } from 'react-i18next';

// Componentes de UI
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileMenu from './components/MobileMenu';
import Quiz from './components/Quiz';
import SearchModal from './components/SearchModal'; 
import Chatbot from './components/Chatbot';

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
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminProductsPage from './pages/AdminProductsPage';

// 🛡️ Componente de Proteção de Rota
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Aguarda o Firebase/Auth inicializar
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MainLayout() {
  const { isCartOpen } = useCart();
  const { i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('@CarefulBaza:theme');
    return savedTheme === 'dark';
  });

  // Gestão de Tema e Idioma do HTML
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.lang = i18n.language || 'pt-BR'; 
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('@CarefulBaza:theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('@CarefulBaza:theme', 'light');
    }
  }, [isDarkMode, i18n.language]);

  // Bloqueio de Scroll quando Modais estão abertos
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
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onOpenQuiz={() => setIsQuizOpen(true)} />
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
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/shop" element={<CollectionPage />} />
            <Route path="/colecao/:categoryId" element={<CollectionPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/ciencia/:topicId?" element={<SciencePage />} />
            <Route path="/rastreio" element={<TrackPage />} />
            <Route path="/info/:pageId" element={<LegalPage />} />
            
            {/* Rotas de Autenticação */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
            <Route path="/verificar-email" element={<VerifyEmailPage />} />
            <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

            {/* Rotas Protegidas */}
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} /> 
            <Route path="/minha-conta" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} /> 
            
            {/* 🛡️ Rota de Administração Protegida */}
            <Route 
              path="/admin/produtos" 
              element={
                <ProtectedRoute>
                  <AdminProductsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
        
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}