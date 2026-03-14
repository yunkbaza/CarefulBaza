import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useCart } from '../context/CartContext'; 
import { useTranslation } from 'react-i18next'; 

// ==========================================
// 🎨 ÍCONES SVG DESENHADOS
// ==========================================
const ChatIconSVG = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CloseIconSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SendIconSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// ==========================================
// ⭐ COMPONENTE PRINCIPAL (AI SALES AGENT)
// ==========================================
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [catalog, setCatalog] = useState([]); 
  const messagesEndRef = useRef(null);

  const { addToCart, setIsCartOpen } = useCart();
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState(() => {
    const savedChat = sessionStorage.getItem('careful_baza_chat_v2');
    return savedChat ? JSON.parse(savedChat) : [
      { text: t('chatbot.greeting', "Olá! Sou o assistente de vendas da CarefulBaza. Como posso ajudar a cuidar da sua pele hoje?"), isBot: true }
    ];
  });

  useEffect(() => {
    sessionStorage.setItem('careful_baza_chat_v2', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(err => console.error("Erro ao carregar catálogo:", err));
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language: i18n.language })
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Adiciona a resposta de texto normal da IA
        setMessages(prev => [...prev, { text: data.reply, isBot: true }]);

        // 🚀 2. MÁGICA DO AGENTE: A IA decidiu invocar uma função?
        if (data.action && data.action.type === 'ADD_TO_CART') {
          // Pequeno delay (800ms) para parecer natural, como se a IA estivesse a digitar e depois abrisse o carrinho
          setTimeout(() => {
            const productInfo = catalog.find(p => p.id === data.action.productId);
            if (productInfo) {
              if (addToCart) addToCart(productInfo);
              if (setIsCartOpen) setIsCartOpen(true); // Abre a gaveta lateral automaticamente!
            }
          }, 800);
        }

      } else {
        setMessages(prev => [...prev, { text: t('chatbot.error', `Erro técnico: ${data.error}`), isBot: true }]);
      }
    } catch (error) {
      console.error("Erro na requisição:", error); 
      setMessages(prev => [...prev, { text: t('chatbot.unavailable', "O serviço está indisponível no momento."), isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mantido apenas por retrocompatibilidade com histórico antigo salvo no sessionStorage
  const handleAddToCartClick = (e, productId) => {
    e.preventDefault(); 
    const productInfo = catalog.find(p => p.id === productId);
    if (productInfo) {
      if (addToCart) addToCart(productInfo);
      if (setIsCartOpen) setIsCartOpen(true);
    }
  };

  return (
    <div className="fixed bottom-[30px] right-[30px] z-[9999] font-['Outfit',sans-serif] overscroll-contain">
      
      {isOpen && (
        <div className="w-[380px] h-[600px] flex flex-col mb-[20px] overflow-hidden rounded-2xl transition-all duration-300
          bg-white border border-[#e4e4e7] shadow-[0_20px_50px_rgba(167,154,240,0.25)]
          dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Cabeçalho */}
          <div className="flex justify-between items-center p-5 border-b
            bg-baza-lavender text-white dark:text-black border-[#8b7de3]
            dark:bg-baza-mint dark:border-[#7a6bd4]"
          >
            <div>
                <strong className="font-['Syne',sans-serif] tracking-[2px] text-[15px] font-bold">
                  CarefulBaza AI
                </strong>
                <div className="text-[10px] text-[#f3ffe3] dark:text-black tracking-[1px] mt-[2px] font-bold">
                  Sales Agent
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="bg-transparent border-none text-white dark:text-black cursor-pointer p-[5px] flex opacity-80 hover:opacity-100 transition-opacity"
            >
                <CloseIconSVG />
            </button>
          </div>

          <div className="flex-1 p-[25px] overflow-y-auto flex flex-col gap-[15px] scrollbar-thin
            bg-[#fafafa] dark:bg-zinc-950"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[85%] flex flex-col ${msg.isBot ? 'self-start items-start' : 'self-end items-end'}`}>
                <div className={`p-[12px_16px] text-[14px] leading-relaxed
                  ${msg.isBot 
                    ? 'rounded-[16px_16px_16px_4px] bg-white text-[#09090b] border border-[#e4e4e7] shadow-sm dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700' 
                    : 'rounded-[16px_16px_4px_16px] bg-[#a79af0] text-white dark:text-black shadow-[0_2px_5px_rgba(167,154,240,0.3)] dark:bg-baza-mint dark:shadow-none'
                  }`}
                >
                  {msg.isBot ? (
                      <ReactMarkdown 
                        components={{
                            // eslint-disable-next-line no-unused-vars
                            p: ({node, ...props}) => <p className="m-0" {...props} />,
                            // eslint-disable-next-line no-unused-vars
                            ul: ({node, ...props}) => <ul className="my-[5px] pl-[20px] list-disc" {...props} />,
                            // eslint-disable-next-line no-unused-vars
                            a: ({node, href, children, ...props}) => {
                                if (href && href.startsWith('#cart:')) {
                                    const productId = href.replace('#cart:', '');
                                    return (
                                        <button 
                                            onClick={(e) => handleAddToCartClick(e, productId)}
                                            className="block w-full mt-[12px] p-[12px] rounded-lg cursor-pointer font-bold text-[13px] uppercase tracking-[1px] transition-all duration-200
                                            bg-[#f3ffe3] text-[#09090b] shadow-[0_4px_6px_rgba(167,154,240,0.15)] border-none hover:bg-[#dff3c8]"
                                        >
                                            {children}
                                        </button>
                                    );
                                }
                                return <a href={href} className="text-[#8b7de3] font-bold underline" {...props}>{children}</a>;
                            }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                  ) : (
                      msg.text
                  )}
                </div>
                <div className="text-[10px] mt-[5px] px-[5px] text-[#71717a] dark:text-zinc-400">
                    {msg.isBot ? t('chatbot.botName', 'Baza Agent') : t('chatbot.you', 'Você')}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="self-start text-[12px] italic pl-[10px] text-[#71717a] dark:text-zinc-400">
                {t('chatbot.processing', 'O agente está a pensar...')}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-[15px] border-t flex gap-[10px] bg-white border-[#e4e4e7] dark:bg-zinc-900 dark:border-zinc-800">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t('chatbot.placeholder', 'Fale sobre a sua pele...')}
              className="flex-1 p-[12px_15px] rounded-lg border outline-none text-[14px] transition-colors
                bg-[#fafafa] border-[#e4e4e7] text-zinc-900 placeholder-zinc-400 focus:border-[#a79af0]
                dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-[#8b7de3]"
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading}
              className={`w-[45px] rounded-lg border-none flex justify-center items-center transition-colors
                bg-baza-lavender text-white hover:bg-baza-mint
                dark:bg-baza-mint dark:text-baza-lavender dark:hover:bg-baza-mint
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <SendIconSVG />
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-[65px] h-[65px] rounded-full border-none cursor-pointer flex justify-center items-center absolute bottom-0 right-0 transition-all duration-300
            bg-baza-lavender text-white shadow-[0_10px_30px_rgba(167,154,240,0.4)]
            hover:scale-105 dark:bg-baza-mint dark:text-black"
        >
          <ChatIconSVG />
        </button>
      )}
    </div>
  );
}