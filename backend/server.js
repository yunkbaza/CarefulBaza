require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 
const axios = require('axios'); 

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const app = express();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'careful_baza_super_secret_key';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'carefulbaza@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
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
            <p style="color: #a1a1aa; margin: 5px 0 0 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Labs</p>
        </td></tr>
        <tr><td style="padding: 50px 40px;">
            <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: normal; color: #09090b;">${title}</h2>
            <p style="margin: 0 0 35px 0; font-size: 15px; line-height: 1.6; color: #52525b;">${text}</p>
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
                  <a href="${buttonLink}" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 16px 36px; text-decoration: none; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border-radius: 2px;">
                    ${buttonText}
                  </a>
            </td></tr></table>
            <p style="margin: 40px 0 0 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">Or paste this link into your browser:<br><a href="${buttonLink}" style="color: #09090b; word-break: break-all;">${buttonLink}</a></p>
        </td></tr>
        <tr><td align="center" style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
            <p style="margin: 0; font-size: 11px; color: #a1a1aa; line-height: 1.6;">
              © ${new Date().getFullYear()} Careful Baza Labs. All rights reserved.<br>
              Contact: <a href="mailto:carefulbaza@gmail.com" style="color: #09090b;">carefulbaza@gmail.com</a>
            </p>
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

app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true } });
  res.json(products.map(p => ({ ...p, price: p.price / 100, compareAtPrice: p.compareAtPrice ? p.compareAtPrice / 100 : null })));
});

app.get('/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true } });
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json({ ...product, price: product.price / 100, compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await prisma.customer.findUnique({ where: { email } })) return res.status(400).json({ error: "This email is already registered." });

    const verificationToken = crypto.randomBytes(32).toString('hex'); 
    await prisma.customer.create({
      data: { name, email, password: await bcrypt.hash(password, 10), verificationToken }
    });

    const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verificar-email?token=${verificationToken}`;
    const html = baseEmailTemplate(`Welcome, ${name}.`, "Please confirm your email to activate your Careful Baza Labs account.", "Verify Email", link);
    
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail({ from: '"Careful Baza Labs" <carefulbaza@gmail.com>', to: email, subject: "Confirm your account", html });
    } else {
      console.log(`🔗 LOCAL TEST (VERIFY): ${link}`);
    }
    res.json({ message: "Account created! Please check your email." });
  } catch (error) { res.status(500).json({ error: "Error creating account." }); }
});

app.post('/auth/verify-email', async (req, res) => {
  const customer = await prisma.customer.findFirst({ where: { verificationToken: req.body.token } });
  if (!customer) return res.status(400).json({ error: "Invalid or expired link." });
  await prisma.customer.update({ where: { id: customer.id }, data: { isVerified: true, verificationToken: null } });
  res.json({ message: "Email successfully verified!" });
});

app.post('/auth/login', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
    if (!customer || !await bcrypt.compare(req.body.password, customer.password)) return res.status(401).json({ error: "Incorrect email or password." });
    
    if (!customer.isVerified) return res.status(403).json({ error: "Please verify your email before logging in.", needsVerification: true, email: customer.email });

    res.json({ token: jwt.sign({ customerId: customer.id }, JWT_SECRET, { expiresIn: '7d' }), user: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
  } catch (error) { res.status(500).json({ error: "Server error." }); }
});

async function getExchangeRate(targetCurrency) {
  if (targetCurrency.toLowerCase() === 'brl') return 1;
  const apiKey = process.env.EXCHANGE_API_KEY;
  if (!apiKey) return 1; 

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/BRL`);
    if (response.data.result === 'success') {
      return response.data.conversion_rates[targetCurrency.toUpperCase()] || 1;
    } 
  } catch (error) {
    console.error("🔴 FALHA DE CONEXÃO COM A API DE CÂMBIO:", error.message);
  }
  return 1;
}

// ==========================================
// CHECKOUT EXCLUSIVO COM STRIPE (AGORA BILÍNGUE)
// ==========================================
app.post('/create-checkout-session', async (req, res) => {
  try {
    // 1. Recebemos também o 'locale' que o site nos enviar
    const { items, currency = 'usd', locale = 'pt' } = req.body; 
    
    // 2. Traduzimos o idioma do seu site para o formato que o Stripe entende
    const stripeLocales = {
      'pt': 'pt-BR',
      'en': 'en',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'ru': 'ru',
      'zh': 'zh'
    };
    const stripeLocale = stripeLocales[locale] || 'auto';

    const rate = await getExchangeRate(currency);
    
    const lineItems = items.map((item) => {
      const priceInClientCurrency = item.price * rate;
      return {
        price_data: {
          currency: currency.toLowerCase(), 
          product_data: { name: item.name, images: [item.image] },
          unit_amount: Math.round(priceInClientCurrency * 100), 
        },
        quantity: item.quantity,
      };
    });

    const totalEmReais = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const FRETE_GRATIS_META_BRL = 250; 
    const valorFreteFixoBRL = 25.90;

    if (totalEmReais < FRETE_GRATIS_META_BRL) {
      const shippingInClientCurrency = valorFreteFixoBRL * rate;
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: 'Shipping / Frete' },
          unit_amount: Math.round(shippingInClientCurrency * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      locale: stripeLocale, // <-- Isto força o Stripe a mudar a linguagem da tela inteira!
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?status=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?status=error`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: 'Failed to process payment with Stripe.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
  console.log(`✅ Global Server running on port ${PORT} with Stripe exclusively!`); 
});