import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 1. INICIALIZAÇÃO INTELIGENTE: Puxa o carrinho salvo no navegador
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('@CarefulBaza:cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch { // <-- O ESLint está feliz agora! Removemos a variável não utilizada.
      return [];
    }
  });

  // 2. PERSISTÊNCIA: Salva no localStorage em tempo real
  useEffect(() => {
    localStorage.setItem('@CarefulBaza:cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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