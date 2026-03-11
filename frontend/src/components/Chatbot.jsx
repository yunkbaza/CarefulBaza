import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

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

  // 🧠 MEMÓRIA DE SESSÃO
  const [messages, setMessages] = useState(() => {
    const savedChat = sessionStorage.getItem('careful_baza_chat');
    return savedChat ? JSON.parse(savedChat) : [
      { text: "Olá! Sou o assistente da CarefulBaza Labs. Como posso te ajudar a cuidar da sua pele hoje?", isBot: true }
    ];
  });

  useEffect(() => {
    sessionStorage.setItem('careful_baza_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
      } else {
        console.error("Erro no Backend:", data.error);
        setMessages(prev => [...prev, { text: `Desculpe, ocorreu um erro técnico: ${data.error}`, isBot: true }]);
      }
    } catch (error) {
      console.error("Erro na requisição:", error); 
      setMessages(prev => [...prev, { text: "O serviço está indisponível no momento. Por favor, tente mais tarde.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCartClick = (e, productId) => {
    e.preventDefault(); 
    const productInfo = catalog.find(p => p.id === productId);
    
    if (productInfo) {
      alert(`O produto ${productInfo.name} foi reconhecido!\nEm breve será adicionado ao carrinho real.`);
      setMessages(prev => [...prev, { text: `✅ Excelente escolha! O **${productInfo.name}** está pronto para ir ao carrinho. Posso ajudar com mais alguma coisa?`, isBot: true }]);
    }
  };

  // 🎨 PALETA OFICIAL BASEADA NO SEU TAILWIND.CONFIG
  const colors = {
    lavender: '#a79af0',      // baza-lavender
    lavenderDark: '#8b7de3',  // Um pouco mais escuro para hover
    mint: '#f3ffe3',          // baza-mint
    mintDark: '#dff3c8',      // Um pouco mais escuro para hover no botão
    textDark: '#09090b',      
    white: '#ffffff',
    gray: '#e4e4e7',
    lightGray: '#fafafa',
    textGray: '#71717a'
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: '"Outfit", sans-serif', overscrollBehavior: 'contain' }}>
      
      {/* 🟢 JANELA DO CHAT */}
      {isOpen && (
        <div style={{ 
          width: '380px', 
          height: '600px', 
          backgroundColor: colors.white, 
          borderRadius: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: '0 20px 50px rgba(167, 154, 240, 0.25)', // Sombra com o tom lavender
          marginBottom: '20px', 
          overflow: 'hidden',
          border: `1px solid ${colors.gray}`,
          transition: 'all 0.3s ease'
        }}>
          
          {/* Cabeçalho */}
          <div style={{ 
            backgroundColor: colors.lavender, 
            color: colors.white, 
            padding: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: `1px solid ${colors.lavenderDark}`
          }}>
            <div>
                <strong style={{ fontFamily: '"Syne", sans-serif', letterSpacing: '2px', fontSize: '15px', fontWeight: '700' }}>
                  CarefulBaza AI
                </strong>
                <div style={{ fontSize: '10px', color: colors.mint, letterSpacing: '1px', marginTop: '2px', fontWeight: 'bold' }}>
                  Labs Assistant
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'none', border: 'none', color: colors.white, cursor: 'pointer', padding: '5px', display: 'flex', opacity: 0.8 }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}
            >
                <CloseIconSVG />
            </button>
          </div>

          {/* Área das Mensagens */}
          <div style={{ 
            flex: 1, 
            padding: '25px', 
            overflowY: 'auto', 
            backgroundColor: colors.lightGray, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '15px',
            scrollbarWidth: 'thin'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ 
                alignSelf: msg.isBot ? 'flex-start' : 'flex-end', 
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.isBot ? 'flex-start' : 'flex-end'
              }}>
                <div style={{ 
                    backgroundColor: msg.isBot ? colors.white : colors.lavender, 
                    color: msg.isBot ? colors.textDark : colors.white, 
                    padding: '12px 16px', 
                    borderRadius: msg.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px', 
                    fontSize: '14px', 
                    lineHeight: '1.5',
                    boxShadow: msg.isBot ? '0 2px 5px rgba(0,0,0,0.03)' : '0 2px 5px rgba(167, 154, 240, 0.3)',
                    border: msg.isBot ? `1px solid ${colors.gray}` : 'none'
                }}>
                  {msg.isBot ? (
                      <ReactMarkdown 
                        components={{
                            p: (props) => {
                                const cleanProps = { ...props };
                                delete cleanProps.node; 
                                return <p style={{margin: 0}} {...cleanProps} />;
                            },
                            ul: (props) => {
                                const cleanProps = { ...props };
                                delete cleanProps.node; 
                                return <ul style={{margin: '5px 0', paddingLeft: '20px'}} {...cleanProps} />;
                            },
                            // RENDERIZAÇÃO DO BOTÃO DE COMPRA EM MINT
                            a: (props) => {
                                const { href, children, ...rest } = props;
                                const cleanProps = { ...rest };
                                delete cleanProps.node;
                                
                                if (href && href.startsWith('#cart:')) {
                                    const productId = href.replace('#cart:', '');
                                    return (
                                        <button 
                                            onClick={(e) => handleAddToCartClick(e, productId)}
                                            style={{
                                                display: 'block', width: '100%', marginTop: '12px', padding: '12px', 
                                                backgroundColor: colors.mint, color: colors.textDark, border: 'none', 
                                                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                                                textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s ease',
                                                boxShadow: '0 4px 6px rgba(167, 154, 240, 0.15)'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = colors.mintDark;
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 12px rgba(167, 154, 240, 0.2)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = colors.mint;
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(167, 154, 240, 0.15)';
                                            }}
                                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                                            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        >
                                            {children}
                                        </button>
                                    );
                                }
                                return <a href={href} style={{ color: colors.lavenderDark, fontWeight: 'bold', textDecoration: 'underline' }} {...cleanProps}>{children}</a>;
                            }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                  ) : (
                      msg.text
                  )}
                </div>
                <div style={{ fontSize: '10px', color: colors.textGray, marginTop: '5px', padding: '0 5px' }}>
                    {msg.isBot ? 'Baza Bot' : 'Você'}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', color: colors.textGray, fontSize: '12px', fontStyle: 'italic', paddingLeft: '10px' }}>
                A processar...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Texto */}
          <div style={{ 
            padding: '15px', 
            borderTop: `1px solid ${colors.gray}`, 
            display: 'flex', 
            gap: '10px', 
            backgroundColor: colors.white 
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Fale sobre a sua pele..."
              style={{ 
                flex: 1, 
                padding: '12px 15px', 
                borderRadius: '8px', 
                border: `1px solid ${colors.gray}`, 
                outline: 'none',
                fontSize: '14px',
                transition: 'border-color 0.2s',
                backgroundColor: colors.lightGray
              }}
              onFocus={(e) => e.target.style.borderColor = colors.lavender}
              onBlur={(e) => e.target.style.borderColor = colors.gray}
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading}
              style={{ 
                backgroundColor: colors.lavender, 
                color: colors.white, 
                border: 'none', 
                width: '45px',
                borderRadius: '8px', 
                cursor: 'pointer', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.5 : 1
              }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.lavenderDark)}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.lavender)}
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
          style={{ 
            width: '65px', 
            height: '65px', 
            borderRadius: '50%', 
            backgroundColor: colors.lavender, 
            color: colors.white, 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            boxShadow: '0 10px 30px rgba(167, 154, 240, 0.4)', 
            transition: 'transform 0.3s ease, boxShadow 0.3s ease',
            position: 'absolute', bottom: '0', right: '0' 
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(167, 154, 240, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(167, 154, 240, 0.4)';
          }}
        >
          <ChatIconSVG />
        </button>
      )}
    </div>
  );
}