import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useCart } from '../context/CartContext'; 
import { useTranslation } from 'react-i18next'; // 🌍 Importando o Tradutor

// ==========================================
// 🎨 ÍCONES SVG DESENHADOS (SEM EMOJIS)
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
// ⭐ COMPONENTE PRINCIPAL
// ==========================================
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [catalog, setCatalog] = useState([]); 
  const messagesEndRef = useRef(null);

  // 🛒 LIGANDO O CHAT AO CARRINHO DA LOJA VIA HOOK
  const { addToCart, setIsCartOpen } = useCart();
  
  // 🌍 PUXANDO O IDIOMA ATUAL E O TRADUTOR
  const { t, i18n } = useTranslation();

  // 🧠 MEMÓRIA DE SESSÃO
  const [messages, setMessages] = useState(() => {
    const savedChat = sessionStorage.getItem('careful_baza_chat');
    return savedChat ? JSON.parse(savedChat) : [
      { text: t('chatbot.greeting', "Olá! Sou o assistente da CarefulBaza Labs. Como posso te ajudar a cuidar da sua pele hoje?"), isBot: true }
    ];
  });

  useEffect(() => {
    sessionStorage.setItem('careful_baza_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    // ✅ Rota corrigida: Se VITE_API_URL já tem /api, isso vira /api/products
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
      
      // 🚀 CORREÇÃO AQUI: Removido o /api extra. Agora fica `${apiUrl}/chat`
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🌍 ENVIANDO O IDIOMA PARA O BACKEND AQUI
        body: JSON.stringify({ message: userMessage, language: i18n.language })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
      } else {
        console.error("Erro no Backend:", data.error);
        setMessages(prev => [...prev, { text: t('chatbot.error', `Desculpe, ocorreu um erro técnico: ${data.error}`), isBot: true }]);
      }
    } catch (error) {
      console.error("Erro na requisição:", error); 
      setMessages(prev => [...prev, { text: t('chatbot.unavailable', "O serviço está indisponível no momento. Por favor, tente mais tarde."), isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 A MÁGICA DO CARRINHO ACONTECE AQUI
  const handleAddToCartClick = (e, productId) => {
    e.preventDefault(); 
    const productInfo = catalog.find(p => p.id === productId);
    
    if (productInfo) {
      if (addToCart) addToCart(productInfo);
      if (setIsCartOpen) setIsCartOpen(true);

      const addedMsg = t('chatbot.added', `✅ Excelente escolha! O **{{name}}** foi adicionado ao seu carrinho.`, { name: productInfo.name });
      setMessages(prev => [...prev, { text: addedMsg, isBot: true }]);
    }
  };

  return (
    <div className="fixed bottom-[30px] right-[30px] z-[9999] font-['Outfit',sans-serif] overscroll-contain">
      
      {/* 🟢 JANELA DO CHAT */}
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
                  Labs Assistant
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="bg-transparent border-none text-white dark:text-black cursor-pointer p-[5px] flex opacity-80 hover:opacity-100 transition-opacity"
            >
                <CloseIconSVG />
            </button>
          </div>

          {/* Área das Mensagens */}
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
                                            bg-[#f3ffe3] text-[#09090b] shadow-[0_4px_6px_rgba(167,154,240,0.15)] border-none
                                            hover:bg-[#dff3c8] hover:-translate-y-[2px] hover:shadow-[0_6px_12px_rgba(167,154,240,0.2)]
                                            active:scale-95 active:translate-y-0"
                                        >
                                            {children}
                                        </button>
                                    );
                                }
                                return <a href={href} className="text-[#8b7de3] font-bold underline dark:text-[#a79af0]" {...props}>{children}</a>;
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
                    {msg.isBot ? t('chatbot.botName', 'Baza Bot') : t('chatbot.you', 'Você')}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="self-start text-[12px] italic pl-[10px] text-[#71717a] dark:text-zinc-400">
                {t('chatbot.processing', 'A processar...')}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Texto */}
          <div className="p-[15px] border-t flex gap-[10px]
            bg-white border-[#e4e4e7]
            dark:bg-zinc-900 dark:border-zinc-800"
          >
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

      {/* 🔵 BOTÃO FLUTUANTE */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-[65px] h-[65px] rounded-full border-none cursor-pointer flex justify-center items-center absolute bottom-0 right-0 transition-all duration-300
            bg-baza-lavender text-white dark:text-black shadow-[0_10px_30px_rgba(167,154,240,0.4)]
            hover:scale-105 hover:shadow-[0_15px_40px_rgba(167,154,240,0.5)]
            dark:bg-baza-mint dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          <ChatIconSVG />
        </button>
      )}
    </div>
  );
}