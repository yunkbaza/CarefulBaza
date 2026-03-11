import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 1. INICIALIZAÇÃO BLINDADA
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('@CarefulBaza:cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch { 
      return [];
    }
  });

  // 2. PERSISTÊNCIA
  useEffect(() => {
    localStorage.setItem('@CarefulBaza:cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 🚀 OTIMIZAÇÃO: useCallback congela as funções para que não sejam recriadas
  const addToCart = useCallback((product) => {
    if (!product || !product.id) return;

    setCartItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find(item => item.id === product.id);
      
      if (existing) {
        return safePrev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...safePrev, { ...product, quantity: 1 }];
    });
    
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => (Array.isArray(prev) ? prev : []).filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCartItems((prev) => (Array.isArray(prev) ? prev : []).map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);

  // 🚀 OTIMIZAÇÃO: useMemo no objeto de valor do Provider
  const value = useMemo(() => ({
    isCartOpen, setIsCartOpen, 
    cartItems, addToCart, removeFromCart, updateQuantity, clearCart, 
    cartCount, cartTotal 
  }), [isCartOpen, cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);