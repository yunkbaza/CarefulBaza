const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const prisma = require('../config/prisma');

const chatComIA = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Chave da API não configurada." });

    const genAI = new GoogleGenerativeAI(apiKey);
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Mensagem vazia." });

    const products = await prisma.product.findMany({
      select: { id: true, name: true, description: true, price: true }
    });

    const productsContext = products.map(p => 
      `- [ID: ${p.id}] ${p.name}: R$ ${(p.price / 100).toFixed(2)} (${p.description || 'Sem descrição'})`
    ).join('\n');

    const regrasLoja = `Você é o assistente virtual de vendas da loja 'Careful Baza Labs'. 
      Ajude os clientes e sugira produtos APENAS com base nesta lista:\n${productsContext}
      🚨 REGRA: Para recomendar, crie um botão usando o formato: [🛒 Adicionar NOME](#cart:ID)`;

    // Vamos usar EXCLUSIVAMENTE a família 1.5 que tem o Free Tier garantido para a sua chave
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: regrasLoja });
      const result = await model.generateContent(message);
      return res.json({ reply: result.response.text() });
    } catch (err) {
      console.warn("⚠️ Falha no gemini-2.5-flash. Tentando modelo de fallback (2.5-flash-8b)...", err.message);
      
      // Fallback para a versão 8b (ainda mais leve e com cota livre)
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-8b" });
      const result = await fallbackModel.generateContent(`${regrasLoja}\n\nCliente: ${message}`);
      return res.json({ reply: result.response.text() });
    }
  } catch (error) {
    res.status(500).json({ error: `Falha no assistente: ${error.message}` });
  }
};

const debugGemini = async (req, res) => {
  res.json({ status: "Em funcionamento via arquitetura modular." });
};

module.exports = { chatComIA, debugGemini };