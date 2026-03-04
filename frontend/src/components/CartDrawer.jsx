import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importação necessária

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Inicialização da tradução
  
  // Meta do Frete Grátis Global (ajustada para 199 USD como exemplo)
  const FREE_SHIPPING_GOAL = 199;
  const safeCartTotal = cartTotal || 0; 
  const progressPercent = Math.min((safeCartTotal / FREE_SHIPPING_GOAL) * 100, 100);
  const amountLeft = Math.max(FREE_SHIPPING_GOAL - safeCartTotal, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsCartOpen(false)} 
      />

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-gray-900 z-[80] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white">{t('cart.title')}</h2>
          <div className="flex items-center gap-4">
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
                {t('cart.empty_btn')}
              </button>
            )}
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {/* BARRA DE FRETE GRÁTIS DINÂMICA */}
        <div className="bg-baza-lavender/5 dark:bg-baza-lavender/10 p-4 border-b border-gray-100 dark:border-gray-800 transition-colors">
          <p className="text-[11px] font-bold text-center text-gray-900 dark:text-white mb-2 uppercase tracking-widest">
            {safeCartTotal >= FREE_SHIPPING_GOAL 
              ? t('cart.free_shipping_success') 
              : t('cart.free_shipping_away', { amount: amountLeft.toFixed(2) })}
          </p>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-baza-lavender dark:bg-baza-mint transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* ÁREA DOS PRODUTOS */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-black flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('cart.empty_cart')}</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 1;

              return (
                <div key={item.id} className="flex gap-4 bg-white dark:bg-gray-900 p-3 rounded-sm shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="w-20 h-24 bg-gray-50 dark:bg-gray-800 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-syne font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                          {item.name}
                        </h3>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-sm">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2.5 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">-</button>
                        <span className="text-xs font-bold w-6 text-center text-gray-900 dark:text-white">{itemQuantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2.5 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">+</button>
                      </div>
                      <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-300">
                        ${(itemPrice * itemQuantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RODAPÉ (CHECKOUT) */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t('cart.subtotal')}</span>
            <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
              ${safeCartTotal.toFixed(2)}
            </span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            onClick={() => {
              setIsCartOpen(false);
              navigate('/checkout');
            }}
            className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
              ${cartItems.length > 0 
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-baza-lavender dark:hover:bg-baza-mint dark:hover:text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}
            `}
          >
            {t('cart.checkout_btn')}
            {cartItems.length > 0 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
          </button>
        </div>

      </div>
    </>
  );
}