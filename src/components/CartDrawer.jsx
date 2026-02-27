import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <>
      {/* Fundo escuro */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[70] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Gaveta */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[80] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-syne text-xl font-bold text-gray-900">Sua Sacola</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-300" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">Sua sacola está vazia.</p>
              <button onClick={() => setIsCartOpen(false)} className="mt-6 text-[10px] font-bold uppercase tracking-widest text-baza-lavender border-b border-baza-lavender pb-1">
                Continuar Explorando
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-sm shadow-sm border border-gray-100">
                <div className="w-20 h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">{item.category}</span>
                      <h3 className="font-syne font-bold text-gray-900 text-sm line-clamp-1 mt-0.5">{item.name}</h3>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-2.5 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">-</button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-2.5 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">+</button>
                    </div>
                    <span className="text-sm font-mono font-bold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé e Checkout */}
        <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Subtotal</span>
            <span className="font-mono text-lg font-bold text-gray-900">
              R$ {cartTotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mb-6 text-center">Frete calculado no checkout.</p>
          <button 
            disabled={cartItems.length === 0}
            className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
              ${cartItems.length > 0 ? 'bg-gray-900 text-white hover:bg-baza-lavender shadow-lg hover:shadow-xl' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            Finalizar Compra
            {cartItems.length > 0 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
          </button>
        </div>

      </div>
    </>
  );
}