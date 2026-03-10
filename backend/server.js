require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 
const axios = require('axios');
const nodemailer = require('nodemailer'); 
const { GoogleGenerativeAI } = require('@google/generative-ai'); 

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const app = express();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());

// ==========================================
// 🛡️ STRIPE WEBHOOK
// ==========================================
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`🔴 Falha na segurança do Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`✅ DINHEIRO NA CONTA! Pagamento confirmado pelo Stripe.`);
    
    const customerId = session.client_reference_id; 
    const totalAmount = session.amount_total; 
    const stripeId = session.id;

    if (customerId && session.metadata?.cart) {
      try {
        const cartItems = JSON.parse(session.metadata.cart);
        const novaOrdem = await prisma.order.create({
          data: {
            totalAmount: totalAmount,
            status: "PAID",
            stripeId: stripeId,
            customerId: customerId,
            items: {
              create: cartItems.map(item => ({
                quantity: item.quantity,
                price: Math.round(item.price * 100),
                product: { connect: { id: item.id } }
              }))
            }
          }
        });
        console.log(`🎉 SUCESSO! Pedido guardado no banco Neon. ID: ${novaOrdem.id}`);
      } catch (dbError) {
        console.error(`🔴 Erro fatal ao salvar pedido no Prisma:`, dbError);
      }
    }
  }
  res.send();
});

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'careful_baza_super_secret_key';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const baseEmailTemplate = (title, text, buttonText, buttonLink) => `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 4px; overflow: hidden;">
        <tr><td align="center" style="padding: 40px 0; background-color: #09090b;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;">Careful Baza</h1>
        </td></tr>
        <tr><td style="padding: 50px 40px;">
            <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: normal; color: #09090b;">${title}</h2>
            <p style="margin: 0 0 35px 0; font-size: 15px; line-height: 1.6; color: #52525b;">${text}</p>
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
                  <a href="${buttonLink}" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 16px 36px; text-decoration: none; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border-radius: 2px;">${buttonText}</a>
            </td></tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Access denied." });
  jwt.verify(authHeader.split(' ')[1], JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Session expired." });
    req.user = user; next();
  });
};

// ==========================================
// 🛍️ ROTAS DE PRODUTOS
// ==========================================
app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true } });
  res.json(products.map(p => ({ ...p, price: p.price / 100, compareAtPrice: p.compareAtPrice ? p.compareAtPrice / 100 : null })));
});

app.get('/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true } });
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json({ ...product, price: product.price / 100, compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null });
});

// ==========================================
// 🤖 ROTA DO CHATBOT COM GEMINI IA (CORRIGIDA COM FALLBACK)
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Chave da API do Gemini não configurada no servidor AWS." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "A mensagem não pode estar vazia." });

    const products = await prisma.product.findMany({
      select: { name: true, description: true, price: true }
    });

    const productsContext = products.map(p => 
      `- ${p.name}: R$ ${(p.price / 100).toFixed(2)} (${p.description || 'Sem descrição extra'})`
    ).join('\n');

    const regrasLoja = `Você é o assistente virtual de vendas da loja 'Careful Baza Labs'. 
      Responda APENAS com base na lista de produtos. Não invente produtos ou preços.
      Aqui está a lista de produtos:\n${productsContext}`;

    try {
      // TENTATIVA 1: Usar o modelo mais novo (1.5 Flash)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: regrasLoja
      });
      const result = await model.generateContent(message);
      return res.json({ reply: result.response.text() });

    } catch (err15) {
      console.warn("⚠️ Falha no gemini-1.5-flash. Tentando modelo de fallback (gemini-pro)...");
      
      // TENTATIVA 2: Fallback automático se a sua chave não suportar o 1.5
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const promptCombinado = `${regrasLoja}\n\nMensagem do cliente: ${message}`;
      
      const result = await fallbackModel.generateContent(promptCombinado);
      return res.json({ reply: result.response.text() });
    }

  } catch (error) {
    console.error("🔴 Erro fatal no chatbot Gemini:", error);
    res.status(500).json({ error: `Desculpe, nosso assistente falhou: ${error.message}` });
  }
});

// ==========================================
// 🚨 ROTA DE DIAGNÓSTICO DO GEMINI (ACESSE PELO NAVEGADOR SE DER ERRO)
// ==========================================
app.get('/api/debug-gemini', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(400).json({ erro: "A chave não está no ambiente." });
    
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    res.json({
      status: "SUCESSO! Sua chave é válida.",
      modelos_disponiveis: response.data.models.map(m => m.name)
    });
  } catch (error) {
    res.status(500).json({ status: "FALHA NA CHAVE", erro: error.message });
  }
});

// ==========================================
// 🔐 ROTAS DE AUTENTICAÇÃO E PAINEL
// ==========================================
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await prisma.customer.findUnique({ where: { email } })) return res.status(400).json({ error: "This email is already registered." });
    const verificationToken = crypto.randomBytes(32).toString('hex'); 
    await prisma.customer.create({ data: { name, email, password: await bcrypt.hash(password, 10), verificationToken } });
    const link = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    const html = baseEmailTemplate(`Welcome, ${name}.`, "Please confirm your email.", "Verify Email", link);
    transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject: "Confirm your account", html }).catch(err => console.error(err));
    res.json({ message: "Account created! Please check your email." });
  } catch (error) { res.status(500).json({ error: "Error creating account." }); }
});

app.post('/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return res.status(404).json({ error: "User not found." });
    if (customer.isVerified) return res.status(400).json({ error: "Already verified." });
    const verificationToken = crypto.randomBytes(32).toString('hex'); 
    await prisma.customer.update({ where: { id: customer.id }, data: { verificationToken } });
    const link = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    const html = baseEmailTemplate(`Welcome back.`, "Please confirm your email.", "Verify", link);
    transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject: "Resend: Confirm your account", html }).catch(err => console.error(err));
    res.json({ message: "Resent successfully!" });
  } catch (error) { res.status(500).json({ error: "Server error." }); }
});

app.post('/auth/verify-email', async (req, res) => {
  const customer = await prisma.customer.findFirst({ where: { verificationToken: req.body.token } });
  if (!customer) return res.status(400).json({ error: "Invalid link." });
  await prisma.customer.update({ where: { id: customer.id }, data: { isVerified: true, verificationToken: null } });
  res.json({ message: "Email successfully verified!" });
});

app.post('/auth/login', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
    if (!customer || !await bcrypt.compare(req.body.password, customer.password)) return res.status(401).json({ error: "Incorrect." });
    if (!customer.isVerified) return res.status(403).json({ error: "Please verify your email.", needsVerification: true, email: customer.email });
    res.json({ token: jwt.sign({ customerId: customer.id }, JWT_SECRET, { expiresIn: '7d' }), user: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
  } catch (error) { res.status(500).json({ error: "Server error." }); }
});

app.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ where: { customerId: req.user.customerId }, orderBy: { createdAt: 'desc' }, include: { items: { include: { product: true } } } });
    res.json(orders.map(order => ({ ...order, totalAmount: order.totalAmount / 100, items: order.items.map(item => ({ ...item, price: item.price / 100 })) })));
  } catch (error) { res.status(500).json({ error: "Falha ao buscar." }); }
});

app.put('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updatedCustomer = await prisma.customer.update({ where: { id: req.user.customerId }, data: { name, phone } });
    res.json({ user: { id: updatedCustomer.id, name: updatedCustomer.name, email: updatedCustomer.email, phone: updatedCustomer.phone } });
  } catch (error) { res.status(500).json({ error: "Falha ao salvar." }); }
});

// ==========================================
// 💳 ROTA DE CHECKOUT (STRIPE)
// ==========================================
async function getExchangeRate(targetCurrency) {
  if (targetCurrency.toLowerCase() === 'brl') return 1;
  const apiKey = process.env.EXCHANGE_API_KEY;
  if (!apiKey) return 1; 
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/BRL`);
    if (response.data.result === 'success') return response.data.conversion_rates[targetCurrency.toUpperCase()] || 1;
  } catch (error) { console.error("🔴 FALHA DE CONEXÃO COM A API DE CÂMBIO:", error.message); }
  return 1;
}

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, currency = 'usd', locale = 'pt', userId } = req.body; 
    const stripeLocale = { 'pt': 'pt-BR', 'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'ru': 'ru', 'zh': 'zh' }[locale] || 'auto';
    const rate = await getExchangeRate(currency);
    
    const lineItems = items.map((item) => ({
        price_data: { currency: currency.toLowerCase(), product_data: { name: item.name, images: [item.image] }, unit_amount: Math.round((item.price * rate) * 100) },
        quantity: item.quantity,
    }));

    const totalEmReais = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (totalEmReais < 250) lineItems.push({ price_data: { currency: currency.toLowerCase(), product_data: { name: 'Shipping / Frete' }, unit_amount: Math.round((25.90 * rate) * 100) }, quantity: 1 });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems, mode: 'payment', locale: stripeLocale, client_reference_id: userId,
      metadata: { cart: JSON.stringify(items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))) },
      success_url: `${FRONTEND_URL}/checkout?status=success`, cancel_url: `${FRONTEND_URL}/checkout?status=error`,
    });
    res.json({ url: session.url });
  } catch (error) { res.status(500).json({ error: 'Failed to process payment.' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`✅ Servidor Global a rodar na porta ${PORT} com Express e IA Gemini!`); });