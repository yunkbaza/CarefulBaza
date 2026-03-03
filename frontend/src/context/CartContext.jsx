import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 1. INICIALIZAÇÃO BLINDADA: Garante que lixo antigo não quebra o site
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('@CarefulBaza:cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Só aceita se for realmente uma lista (array)
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch { 
      return [];
    }
  });

  // 2. PERSISTÊNCIA: Salva no localStorage
  useEffect(() => {
    localStorage.setItem('@CarefulBaza:cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    // Trava de segurança: Se o produto não for válido, ignora.
    if (!product || !product.id) return;

    setCartItems((prev) => {
      // Garante que o estado anterior é uma lista
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
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => (Array.isArray(prev) ? prev : []).filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) => (Array.isArray(prev) ? prev : []).map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  // Cálculos matemáticos protegidos contra valores nulos
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ 
      isCartOpen, setIsCartOpen, 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartCount, cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);