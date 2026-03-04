require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe'); // Voltamos para a Stripe (Global)
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const app = express();

// Inicializamos a Stripe com a chave do .env
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

// ==========================================
// TEMPLATES DE E-MAIL (AGORA EM INGLÊS DE LUXO)
// ==========================================
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

app.post('/auth/resend-verification', async (req, res) => {
  const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
  if (!customer) return res.status(404).json({ error: "Account not found." });
  if (customer.isVerified) return res.status(400).json({ error: "This account is already verified." });

  const verificationToken = crypto.randomBytes(32).toString('hex');
  await prisma.customer.update({ where: { email: customer.email }, data: { verificationToken } });
  const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verificar-email?token=${verificationToken}`;
  const html = baseEmailTemplate("New Access Link", "You requested a new verification link. Click the button below to activate your account.", "Verify Email", link);
  
  if (process.env.EMAIL_PASS) await transporter.sendMail({ from: '"Careful Baza Labs" <carefulbaza@gmail.com>', to: customer.email, subject: "Resend: Confirm your account", html });
  res.json({ message: "Verification email resent!" });
});

app.post('/auth/login', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
    if (!customer || !await bcrypt.compare(req.body.password, customer.password)) return res.status(401).json({ error: "Incorrect email or password." });
    
    if (!customer.isVerified) return res.status(403).json({ error: "Please verify your email before logging in.", needsVerification: true, email: customer.email });

    res.json({ token: jwt.sign({ customerId: customer.id }, JWT_SECRET, { expiresIn: '7d' }), user: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
  } catch (error) { res.status(500).json({ error: "Server error." }); }
});

app.post('/auth/forgot-password', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
    if (!customer) return res.status(200).json({ message: "If the email exists in our database, you will receive a recovery link." });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.customer.update({ where: { email: customer.email }, data: { resetToken } });

    const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha?token=${resetToken}`;
    const html = baseEmailTemplate("Password Recovery", "We received a request to change your account password. If this was not you, please ignore this email.", "Reset Password", link);
    
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail({ from: '"Careful Baza Labs" <carefulbaza@gmail.com>', to: customer.email, subject: "Reset your password", html });
    } else {
      console.log(`🔗 LOCAL TEST (RESET PASSWORD): ${link}`);
    }
    
    res.json({ message: "If the email exists in our database, you will receive a recovery link." });
  } catch (error) { res.status(500).json({ error: "Error processing request." }); }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const customer = await prisma.customer.findFirst({ where: { resetToken: token } });
    if (!customer) return res.status(400).json({ error: "Invalid or expired recovery link." });

    await prisma.customer.update({
      where: { id: customer.id },
      data: { password: await bcrypt.hash(newPassword, 10), resetToken: null }
    });

    res.json({ message: "Password changed successfully! You can now log in." });
  } catch (error) { res.status(500).json({ error: "Error changing password." }); }
});

app.put('/auth/profile', authenticateToken, async (req, res) => {
  const updatedCustomer = await prisma.customer.update({ where: { id: req.user.customerId }, data: { name: req.body.name, phone: req.body.phone } });
  res.json({ message: "Profile updated successfully!", user: { id: updatedCustomer.id, name: updatedCustomer.name, email: updatedCustomer.email, phone: updatedCustomer.phone } });
});

app.get('/my-orders', authenticateToken, async (req, res) => {
  const orders = await prisma.order.findMany({ where: { customerId: req.user.customerId }, include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
  res.json(orders.map(o => ({ ...o, totalAmount: o.totalAmount / 100, items: o.items.map(i => ({ ...i, price: i.price / 100 })) })));
});

app.post('/debug/create-test-order', authenticateToken, async (req, res) => {
  try {
    const product = await prisma.product.findFirst();
    if (!product) return res.status(400).json({ error: "No products available to create a test order." });

    await prisma.order.create({
      data: {
        totalAmount: product.price,
        status: 'PAID',
        customerId: req.user.customerId,
        addressLine1: 'Global Luxury St, 100',
        city: 'New York',
        state: 'NY',                 
        zipCode: '10001',        
        trackingCode: `BZ${Math.floor(Math.random() * 1000000000)}US`, 
        items: { create: [{ quantity: 1, price: product.price, productId: product.id }] }
      }
    });
    res.json({ message: "Test order generated successfully!" });
  } catch (error) { 
    console.error("ERROR CREATING TEST ORDER:", error);
    res.status(500).json({ error: "Internal error creating order." }); 
  }
});

// ==========================================
// CHECKOUT GLOBAL COM STRIPE (EM DÓLAR - USD)
// ==========================================
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body; 

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd', // Moeda universal do comércio eletrônico
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Stripe cobra em cêntimos ($189.90 = 18990)
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      // Adicionado suporte a Apple Pay e Google Pay automaticamente pela Stripe
      payment_method_types: ['card', 'paypal'], 
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173/checkout?status=success',
      cancel_url: 'http://localhost:5173/checkout?status=error',
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: 'Failed to process payment with Stripe.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
  console.log(`✅ Global Server running on port ${PORT} with Stripe (USD)!`); 
});