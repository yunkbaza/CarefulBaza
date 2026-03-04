import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';

// --- FUNÇÕES DE MÁSCARA ---
const maskPhone = (val) => val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4}).*/, '$1-$2').substring(0, 15);
const maskCPF = (val) => val.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
const maskCEP = (val) => val.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { convertAndFormat } = useCurrency();
  
  const [checkoutStatus, setCheckoutStatus] = useState('form');
  const [orderNumber, setOrderNumber] = useState('');
  
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');

  // Lógica de Frete baseada em USD (padrão do nosso hook)
  const FREE_SHIPPING_GOAL = 50; 
  const shippingCost = cartTotal >= FREE_SHIPPING_GOAL ? 0 : 5.00;
  const finalTotal = cartTotal + shippingCost;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('status') === 'success') {
      const randomOrder = `BZ-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      setOrderNumber(randomOrder);
      setCheckoutStatus('success');
      clearCart();
    }
    if (query.get('status') === 'error') {
      setCheckoutStatus('error');
    }
  }, [location.search, clearCart]);

  useEffect(() => {
    if (cartItems.length === 0 && checkoutStatus !== 'success' && checkoutStatus !== 'error') {
      navigate('/shop');
    }
  }, [cartItems, checkoutStatus, navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setCheckoutStatus('processing');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems,
          currency: i18n.language === 'pt' ? 'brl' : 'usd' // Informa ao Stripe a moeda preferencial
        }), 
      });

      if (!response.ok) throw new Error('Server connection failed');
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutStatus('error');
    }
  };

  // --- FEEDBACKS DE STATUS ---
  if (checkoutStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-6 transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-800 border-t-baza-lavender dark:border-t-baza-mint rounded-full animate-spin mb-8"></div>
        <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.processing')}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t('checkout.secure_notice')}</p>
      </div>
    );
  }

  if (checkoutStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 transition-colors duration-300 pt-20 pb-32">
        <div className="max-w-xl w-full bg-white dark:bg-gray-800 p-10 md:p-16 shadow-2xl border border-gray-100 dark:border-gray-700 text-center rounded-sm">
          <div className="w-20 h-20 bg-baza-mint text-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('auth.verify_success_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">{t('auth.verify_success_msg')}</p>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-700 mb-10">
            <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">ID: {orderNumber}</span>
          </div>
          <Link to="/" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-all shadow-md">
            {t('auth.verify_back_btn')}
          </Link>
        </div>
      </div>
    );
  }

  // --- FORMULÁRIO DE CHECKOUT ---
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10 pb-32 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="py-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t('checkout.back_cart')}
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div className="flex-1">
            <h1 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10">{t('checkout.title')}</h1>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-12">
              <section>
                <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">1. {t('auth.name_label')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t('auth.email_label')}</label>
                    <input type="email" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t('auth.forgot_label')}</label>
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(maskPhone(e.target.value))}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" 
                      placeholder="+00 00000-0000" 
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">2. {t('checkout.shipping_address')}</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t('auth.name_label')}</label>
                      <input type="text" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender" />
                    </div>
                    {/* Exibe CPF apenas para brasileiros */}
                    {i18n.language === 'pt' && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">CPF</label>
                        <input type="text" required value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender" placeholder="000.000.000-00" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t('checkout.address_label')}</label>
                      <input type="text" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t('checkout.zip_label')}</label>
                      <input type="text" required value={cep} onChange={(e) => setCep(maskCEP(e.target.value))} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender" />
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>

          <div className="lg:w-[420px] w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 shadow-xl sticky top-32 transition-colors">
              <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-6">{t('checkout.order_summary')}</h2>
              
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-50 dark:bg-gray-900 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-syne font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] text-gray-500 uppercase">Qtd: {item.quantity}</span>
                      <span className="font-mono text-sm font-bold text-gray-900 dark:text-white mt-1">
                        {convertAndFormat(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{t('cart.subtotal')}</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{convertAndFormat(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{t('science.solution_title')}</span>
                  <span className={`font-mono font-bold ${shippingCost === 0 ? 'text-baza-mint' : 'text-gray-900 dark:text-white'}`}>
                    {shippingCost === 0 ? t('quiz.free_shipping') : convertAndFormat(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-900 dark:border-gray-700 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">{t('checkout.total')}</span>
                  <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{convertAndFormat(finalTotal)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 text-xs font-bold uppercase tracking-widest hover:bg-baza-lavender transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {t('checkout.complete_btn')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="text-[9px] uppercase tracking-widest font-bold">{t('checkout.secure_notice')}</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}