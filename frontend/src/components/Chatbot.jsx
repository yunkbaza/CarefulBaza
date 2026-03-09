import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Olá! Sou o assistente da Careful Baza Labs. Como posso te ajudar hoje?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Faz o scroll descer automaticamente quando chega mensagem nova
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    // Adiciona a mensagem do usuário na tela
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      // Puxa a URL do seu .env do frontend
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
        setMessages(prev => [...prev, { text: "Ops, deu um erro de conexão. Tente novamente.", isBot: true }]);
      }
    } catch (error) {
      // Correção do aviso do ESLint: agora a variável 'error' está sendo utilizada!
      console.error("Erro na requisição do chat:", error); 
      setMessages(prev => [...prev, { text: "Servidor indisponível no momento.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, fontFamily: 'sans-serif' }}>
      
      {/* JANELA DO CHAT */}
      {isOpen && (
        <div style={{ width: '350px', height: '500px', backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '15px', overflow: 'hidden' }}>
          
          {/* Cabeçalho */}
          <div style={{ backgroundColor: '#09090b', color: '#fff', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ letterSpacing: '1px' }}>Careful Baza AI</strong>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>✖</button>
          </div>

          {/* Área das Mensagens */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.isBot ? 'flex-start' : 'flex-end', backgroundColor: msg.isBot ? '#e4e4e7' : '#09090b', color: msg.isBot ? '#000' : '#fff', padding: '10px 14px', borderRadius: '8px', maxWidth: '80%', fontSize: '14px', lineHeight: '1.4' }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#e4e4e7', padding: '10px 14px', borderRadius: '8px', fontSize: '12px' }}>
                Digitando...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Texto */}
          <div style={{ padding: '10px', borderTop: '1px solid #e4e4e7', display: 'flex', gap: '10px', backgroundColor: '#fff' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite sua mensagem..."
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e4e4e7', outline: 'none' }}
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading}
              style={{ backgroundColor: '#09090b', color: '#fff', border: 'none', padding: '0 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* BOTÃO FLUTUANTE (ABRIR CHAT) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#09090b', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '24px', position: 'absolute', bottom: '0', right: '0' }}
        >
          💬
        </button>
      )}
    </div>
  );
}