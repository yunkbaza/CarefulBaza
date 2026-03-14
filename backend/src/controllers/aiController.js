const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const prisma = require('../config/prisma');
const CircuitBreaker = require('opossum');

// 🧠 1. O CÉREBRO DO AGENTE (Agora com Function Calling!)
const fetchFromGemini = async (apiKey, message, regrasLoja) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // 🛠️ AS FERRAMENTAS DO AGENTE: Ensinamos a IA que ela pode executar ações reais
  const tools = [{
    functionDeclarations: [{
      name: "add_to_cart",
      description: "Aciona o sistema para adicionar um produto diretamente no carrinho do cliente. Chame esta função SEMPRE que o cliente demonstrar intenção clara de compra, pedir para levar, ou aceitar uma recomendação.",
      parameters: {
        type: "OBJECT",
        properties: {
          productId: { type: "STRING", description: "O ID exato do produto a ser adicionado." },
          respostaCliente: { type: "STRING", description: "A frase amigável que você vai dizer ao cliente (ex: 'Excelente escolha! Já adicionei o sérum ao seu carrinho.')" }
        },
        required: ["productId", "respostaCliente"]
      }
    }]
  }];

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: regrasLoja,
      tools: tools // 👈 Entregamos a ferramenta nas mãos da IA
    });
    
    const result = await model.generateContent(message);
    const response = result.response;

    // 🚀 O Agente decidiu usar a ferramenta?
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      
      if (call.name === "add_to_cart") {
        console.log(`[AI Agent] 🛒 Ação acionada pela IA! Produto: ${call.args.productId}`);
        // Devolvemos um objeto estruturado que o nosso Frontend React vai entender
        return {
          reply: call.args.respostaCliente,
          action: { type: 'ADD_TO_CART', productId: call.args.productId }
        };
      }
    }

    // Se não usou a ferramenta, é apenas uma conversa normal
    return { reply: response.text(), action: null };

  } catch (err) {
    console.warn("⚠️ Falha na Tentativa 1 (Function Calling). Fallback universal ativado...", err.message);
    
    // Fallback: Tenta responder apenas com texto se a ferramenta falhar
    const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const promptCompleto = `${regrasLoja}\n\n--- MENSAGEM DO CLIENTE ---\n${message}`;
    const result = await fallbackModel.generateContent(promptCompleto);
    
    return { reply: result.response.text(), action: null };
  }
};

// 🛡️ 2. O DISJUNTOR (CIRCUIT BREAKER) - Mantém o sistema vivo
const breaker = new CircuitBreaker(fetchFromGemini, {
  timeout: 10000,              
  errorThresholdPercentage: 50,
  resetTimeout: 30000          
});

// 🛡️ 3. O PLANO DE EMERGÊNCIA (Agora também retorna no formato { reply, action })
breaker.fallback(() => {
  console.warn("[Circuit Breaker] ⚠️ O Gemini falhou completamente. Fallback de emergência ativado!");
  return {
    reply: "Peço imensa desculpa, mas o meu cérebro de inteligência artificial está a passar por uma instabilidade com os servidores no momento. Por favor, navegue pelo nosso catálogo de produtos ou tente mandar uma mensagem novamente em alguns minutos! 🛒",
    action: null
  };
});

// 🚀 4. O CONTROLADOR PRINCIPAL
const chatComIA = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Chave da API não configurada." });

    const { message, language = 'pt' } = req.body;
    if (!message) return res.status(400).json({ error: "Mensagem vazia." });

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

    // 🧠 REGRA DE OURO DO AGENTE: Agora instruímos a IA a ser proativa
    const regrasLoja = `Você é o assistente virtual de vendas da loja 'Careful Baza Labs'. 
      Ajude os clientes e sugira produtos APENAS com base nesta lista:\n${productsContext}
      🚨 REGRA 1: Você é um Agente de Vendas. Sempre que o cliente decidir levar um produto, acione IMEDIATAMENTE a ferramenta 'add_to_cart'. Não peça para o cliente clicar em links.
      🚨 REGRA 2: Você DEVE conversar com o cliente e gerar suas respostas EXCLUSIVAMENTE em: ${targetLanguage}.`;

    // Dispara o disjuntor, que agora retorna o objeto final { reply, action }
    const agentResponse = await breaker.fire(apiKey, message, regrasLoja);
    
    // O res.json envia o objeto certinho para o React ativar a gaveta do carrinho
    return res.json(agentResponse);

  } catch (error) {
    console.error("🔴 Erro Fatal IA (Fora do Circuit Breaker):", error);
    res.status(500).json({ error: `Falha no assistente: ${error.message}` });
  }
};

const debugGemini = async (req, res) => {
  res.json({ 
    status: "Agente IA Operacional e Protegido pelo Opossum.",
    breakerStats: { isClosed: breaker.closed, failures: breaker.stats.failures, fallbacks: breaker.stats.fallbacks }
  });
};

module.exports = { chatComIA, debugGemini };