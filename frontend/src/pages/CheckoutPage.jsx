import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// --- FUNÇÕES DE MÁSCARA (Expressões Regulares) ---
const maskPhone = (val) => val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4}).*/, '$1-$2').substring(0, 15);
const maskCPF = (val) => val.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
const maskCEP = (val) => val.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // Lê o URL que volta do Stripe
  
  const [checkoutStatus, setCheckoutStatus] = useState('form');
  const [orderNumber, setOrderNumber] = useState('');
  
  // Estados controlados pelas máscaras
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');

  // Lógica de Frete
  const FREE_SHIPPING_GOAL = 250;
  const shippingCost = cartTotal >= FREE_SHIPPING_GOAL ? 0 : 25.90;
  const finalTotal = cartTotal + shippingCost;

  // LÊ O RETORNO DO STRIPE (Sucesso ou Erro)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    
    if (query.get('status') === 'success') {
      const randomOrder = `BZ-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      setOrderNumber(randomOrder);
      setCheckoutStatus('success');
      clearCart(); // Esvazia o carrinho só se pagar
    }
    
    if (query.get('status') === 'error') {
      setCheckoutStatus('error');
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bloqueia checkout sem itens (exceto nas telas de feedback)
  useEffect(() => {
    if (cartItems.length === 0 && checkoutStatus !== 'success' && checkoutStatus !== 'error') {
      navigate('/shop');
    }
  }, [cartItems, checkoutStatus, navigate]);

  // INTEGRAÇÃO REAL COM A SUA API NODE.JS
  const handleCheckout = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setCheckoutStatus('processing');

    try {
      // Faz o pedido à sua API na porta 3000
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }), 
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o servidor');
      }

      const data = await response.json();
      
      // Redireciona o cliente para o ecrã oficial do Stripe!
      window.location.href = data.url;

    } catch (error) {
      console.error("Erro no checkout:", error);
      setCheckoutStatus('error'); // Se a API estiver desligada, mostra erro
    }
  };

  // --- TELA 2: PROCESSANDO ---
  if (checkoutStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-6 transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-800 border-t-baza-lavender dark:border-t-baza-mint rounded-full animate-spin mb-8"></div>
        <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-2">Processando Pagamento...</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">A redirecionar para o ambiente seguro do Stripe...</p>
      </div>
    );
  }

  // --- TELA 3: APROVADO ---
  if (checkoutStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 transition-colors duration-300 pt-20 pb-32">
        <div className="max-w-xl w-full bg-white dark:bg-gray-800 p-10 md:p-16 shadow-2xl border border-gray-100 dark:border-gray-700 text-center animate-in fade-in zoom-in duration-500 rounded-sm">
          <div className="w-20 h-20 bg-baza-lavender dark:bg-baza-mint text-white dark:text-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="text-baza-lavender dark:text-baza-mint font-bold uppercase tracking-widest text-[10px] mb-4 block">Pagamento Aprovado</span>
          <h1 className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4">Pedido Confirmado!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
            O seu ritual de cuidados já está a ser preparado pelo nosso laboratório. O recibo com os detalhes foi enviado por e-mail pelo Stripe.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-700 mb-10">
            <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">Número do Pedido</span>
            <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{orderNumber}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rastreio" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-colors shadow-md">
              Acompanhar Entrega
            </Link>
            <Link to="/" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:border-gray-900 dark:hover:border-white transition-colors">
              Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA 4: RECUSADO / CANCELADO ---
  if (checkoutStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 transition-colors duration-300 pt-20 pb-32">
        <div className="max-w-xl w-full bg-white dark:bg-gray-800 p-10 md:p-16 shadow-2xl border border-gray-100 dark:border-gray-700 text-center animate-in fade-in zoom-in duration-500 rounded-sm">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border border-red-200 dark:border-red-800/50">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <span className="text-red-500 font-bold uppercase tracking-widest text-[10px] mb-4 block">Pagamento Interrompido</span>
          <h1 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-4">Pagamento Recusado</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-sm leading-relaxed">
            O pagamento não foi concluído ou foi cancelado no Stripe. Os seus produtos continuam no carrinho, caso queira tentar novamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCheckoutStatus('form')}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-colors shadow-md"
            >
              Tentar Novamente
            </button>
            <Link to="/info/faq" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:border-gray-900 dark:hover:border-white transition-colors">
              Precisa de ajuda?
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA 1: FORMULÁRIO PADRÃO ---
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10 pb-32 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="py-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar para a Loja
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div className="flex-1">
            <h1 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 transition-colors">Finalizar Pedido</h1>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-12">
              
              <section>
                <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors">1. Contato</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">E-mail</label>
                    <input type="email" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors shadow-sm" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Telefone</label>
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(maskPhone(e.target.value))}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors shadow-sm" 
                      placeholder="(00) 00000-0000" 
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors">2. Entrega</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Nome Completo</label>
                      <input type="text" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors shadow-sm" placeholder="Como no documento" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">CPF</label>
                      <input 
                        type="text" 
                        required 
                        value={cpf}
                        onChange={(e) => setCpf(maskCPF(e.target.value))}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors shadow-sm" 
                        placeholder="000.000.000-00" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Endereço</label>
                      <input type="text" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors shadow-sm" placeholder="Rua, Avenida..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Número</label>
                      <input type="text" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors shadow-sm" placeholder="123" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">CEP</label>
                      <input 
                        type="text" 
                        required 
                        value={cep}
                        onChange={(e) => setCep(maskCEP(e.target.value))}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors shadow-sm" 
                        placeholder="00000-000" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Cidade / Estado</label>
                      <input type="text" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-baza-lavender dark:focus:border-baza-mint transition-colors shadow-sm" placeholder="São Paulo / SP" />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
                  <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white transition-colors">3. Pagamento</h2>
                  <div className="flex items-center gap-1 text-baza-lavender dark:text-baza-mint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Seguro SSL</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6 transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-baza-lavender dark:text-baza-mint accent-baza-lavender dark:accent-baza-mint" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">Pix, Cartão (até 12x) ou Boleto</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-900 rounded-sm border border-gray-100 dark:border-gray-800">
                    Ao clicar em confirmar, você será redirecionado(a) para o ambiente criptografado do Stripe para introduzir os dados do seu cartão com total segurança.
                  </p>
                </div>
              </section>
            </form>
          </div>

          <div className="lg:w-[420px] w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 shadow-xl sticky top-32 transition-colors duration-300">
              <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-50 dark:bg-gray-900 rounded-sm overflow-hidden flex-shrink-0 transition-colors">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-syne font-bold text-gray-900 dark:text-white text-sm line-clamp-1 transition-colors">{item.name}</h4>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 transition-colors">Qtd: {item.quantity}</span>
                      <span className="font-mono text-sm font-bold text-gray-900 dark:text-white mt-1 transition-colors">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-4 mb-6 transition-colors">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Frete</span>
                  <span className={`font-mono font-bold ${shippingCost === 0 ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-900 dark:text-white'}`}>
                    {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-900 dark:border-gray-700 pt-6 mb-8 transition-colors">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">Total</span>
                  <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 text-xs font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
              >
                Ir para Pagamento (Stripe)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span className="text-[9px] uppercase tracking-widest font-bold">Criptografia SSL 256-bit</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}