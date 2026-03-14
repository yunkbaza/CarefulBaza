const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const prisma = require('../config/prisma');
const CircuitBreaker = require('opossum');

// 🛡️ 1. A FUNÇÃO DE RISCO: Onde falamos com o mundo externo (Google)
// Toda a sua lógica de tentativa 1 e tentativa 2 foi isolada aqui dentro.
const fetchFromGemini = async (apiKey, message, regrasLoja) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Tentativa 1: Formato Moderno
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: regrasLoja });
    const result = await model.generateContent(message);
    return result.response.text();
  } catch (err) {
    console.warn("⚠️ Falha na Tentativa 1. A usar o Fallback Universal...", err.message);
    
    // Tentativa 2: Fallback Universal apontado para o 2.5-flash
    const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const promptCompleto = `${regrasLoja}\n\n--- MENSAGEM DO CLIENTE ---\n${message}`;
    
    const result = await fallbackModel.generateContent(promptCompleto);
    return result.response.text();
  }
};

// 🛡️ 2. O DISJUNTOR (CIRCUIT BREAKER)
const breaker = new CircuitBreaker(fetchFromGemini, {
  timeout: 10000,              // Se a Google demorar mais de 10s, abortamos para não travar o servidor.
  errorThresholdPercentage: 50,// Se 50% das chamadas falharem (Google fora do ar), o disjuntor "abre".
  resetTimeout: 30000          // Fica 30s aberto devolvendo a mensagem de emergência, depois tenta religar.
});

// 🛡️ 3. O PLANO DE EMERGÊNCIA (Quando o disjuntor está "Aberto")
breaker.fallback(() => {
  console.warn("[Circuit Breaker] ⚠️ O Gemini falhou completamente ou o disjuntor abriu. Fallback de emergência ativado!");
  return "Peço imensa desculpa, mas o meu cérebro de inteligência artificial está a passar por uma instabilidade com os servidores no momento. Por favor, navegue pelo nosso catálogo de produtos ou tente mandar uma mensagem novamente em alguns minutos! 🛒";
});

// 🚀 4. O CONTROLADOR PRINCIPAL
const chatComIA = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Chave da API não configurada." });

    // 🌍 RECEBEMOS O IDIOMA DO FRONTEND
    const { message, language = 'pt' } = req.body;
    
    if (!message) return res.status(400).json({ error: "Mensagem vazia." });

    // Mapeamento de siglas para nomes de idiomas
    const languageMap = {
      'pt': 'Português', 'en': 'Inglês', 'es': 'Espanhol', 
      'fr': 'Francês', 'de': 'Alemão', 'ru': 'Russo', 'zh': 'Chinês'
    };
    const targetLanguage = languageMap[language] || 'Português';

    const products = await prisma.product.findMany({
      select: { id: true, name: true, description: true, price: true }
    });

    const productsContext = products.map(p => 
      `- [ID: ${p.id}] ${p.name}: R$ ${(p.price / 100).toFixed(2)} (${p.description || 'Sem descrição'})`
    ).join('\n');

    // Regras rígidas para a IA
    const regrasLoja = `Você é o assistente virtual de vendas da loja 'Careful Baza Labs'. 
      Ajude os clientes e sugira produtos APENAS com base nesta lista:\n${productsContext}
      🚨 REGRA 1: Para recomendar, crie um botão usando exatamente o formato: [🛒 Adicionar NOME](#cart:ID)
      🚨 REGRA 2: Você DEVE conversar com o cliente e gerar suas respostas EXCLUSIVAMENTE em: ${targetLanguage}.`;

    // 🔥 EM VEZ DE CHAMAR A API DIRETAMENTE, NÓS DISPARAMOS O DISJUNTOR
    const reply = await breaker.fire(apiKey, message, regrasLoja);
    return res.json({ reply });

  } catch (error) {
    console.error("🔴 Erro Fatal IA (Fora do Circuit Breaker):", error);
    res.status(500).json({ error: `Falha no assistente: ${error.message}` });
  }
};

const debugGemini = async (req, res) => {
  res.json({ 
    status: "Em funcionamento com a versão mais recente do Gemini e protegido pelo Opossum.",
    breakerStats: {
      isClosed: breaker.closed, // Se for "true", a API do Google está saudável.
      failures: breaker.stats.failures,
      fallbacks: breaker.stats.fallbacks
    }
  });
};

module.exports = { chatComIA, debugGemini };