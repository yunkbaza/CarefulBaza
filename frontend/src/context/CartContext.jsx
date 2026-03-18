import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Inicialização segura com LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('@CarefulBaza:cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch { 
      return [];
    }
  });

  // Persistência automática no LocalStorage
  useEffect(() => {
    localStorage.setItem('@CarefulBaza:cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    if (!product || !product.id) return;

    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCartItems((prev) => prev.map(item => {
      if (item.id === id) {
        const newQuantity = (item.quantity || 1) + delta;
        return newQuantity >= 1 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = useMemo(() => 
    cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0), 
  [cartItems]);

  const cartTotal = useMemo(() => 
    cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0), 
  [cartItems]);

  const value = useMemo(() => ({
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartCount, 
    cartTotal 
  }), [isCartOpen, cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// 🛡️ A CORREÇÃO: Esta linha silencia o aviso do Fast Refresh para o Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);