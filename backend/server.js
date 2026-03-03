require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 

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

// Transportador Oficial da Careful Baza
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'carefulbaza@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// TEMPLATES DE E-MAIL DE ALTO PADRÃO
// ==========================================
const baseEmailTemplate = (title, text, buttonText, buttonLink) => `
<!DOCTYPE html>
<html lang="pt-BR">
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
            <p style="margin: 40px 0 0 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">Ou cole este link no seu navegador:<br><a href="${buttonLink}" style="color: #09090b; word-break: break-all;">${buttonLink}</a></p>
        </td></tr>
        <tr><td align="center" style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
            <p style="margin: 0; font-size: 11px; color: #a1a1aa; line-height: 1.6;">
              © ${new Date().getFullYear()} Careful Baza Labs. Todos os direitos reservados.<br>
              Contacto: <a href="mailto:carefulbaza@gmail.com" style="color: #09090b;">carefulbaza@gmail.com</a>
            </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

// Segurança para rotas fechadas
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Acesso negado." });
  jwt.verify(authHeader.split(' ')[1], JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Sessão expirada." });
    req.user = user; next();
  });
};

// ==========================================
// PRODUTOS
// ==========================================
app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true } });
  res.json(products.map(p => ({ ...p, price: p.price / 100, compareAtPrice: p.compareAtPrice ? p.compareAtPrice / 100 : null })));
});

app.get('/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true } });
  if (!product) return res.status(404).json({ error: "Produto não encontrado" });
  res.json({ ...product, price: product.price / 100, compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null });
});

// ==========================================
// AUTENTICAÇÃO E VERIFICAÇÃO DE E-MAIL
// ==========================================
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await prisma.customer.findUnique({ where: { email } })) return res.status(400).json({ error: "Este e-mail já está registado." });

    const verificationToken = crypto.randomBytes(32).toString('hex'); 
    await prisma.customer.create({
      data: { name, email, password: await bcrypt.hash(password, 10), verificationToken }
    });

    const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verificar-email?token=${verificationToken}`;
    const html = baseEmailTemplate(`Bem-vindo(a), ${name}.`, "Por favor, confirme o seu e-mail para ativar a sua conta na Careful Baza Labs.", "Verificar E-mail", link);
    
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail({ from: '"Careful Baza Labs" <carefulbaza@gmail.com>', to: email, subject: "Confirme a sua conta", html });
    } else {
      console.log(`🔗 TESTE LOCAL (VERIFICAR): ${link}`);
    }
    res.json({ message: "Conta criada! Verifique o seu e-mail." });
  } catch (error) { res.status(500).json({ error: "Erro ao criar conta." }); }
});

app.post('/auth/verify-email', async (req, res) => {
  const customer = await prisma.customer.findFirst({ where: { verificationToken: req.body.token } });
  if (!customer) return res.status(400).json({ error: "Link inválido ou expirado." });
  await prisma.customer.update({ where: { id: customer.id }, data: { isVerified: true, verificationToken: null } });
  res.json({ message: "E-mail verificado com sucesso!" });
});

app.post('/auth/resend-verification', async (req, res) => {
  const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
  if (!customer) return res.status(404).json({ error: "Conta não encontrada." });
  if (customer.isVerified) return res.status(400).json({ error: "Esta conta já está verificada." });

  const verificationToken = crypto.randomBytes(32).toString('hex');
  await prisma.customer.update({ where: { email: customer.email }, data: { verificationToken } });
  const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verificar-email?token=${verificationToken}`;
  const html = baseEmailTemplate("Novo link de acesso", "Solicitou um novo link de verificação. Clique no botão abaixo para ativar a sua conta.", "Verificar E-mail", link);
  
  if (process.env.EMAIL_PASS) await transporter.sendMail({ from: '"Careful Baza Labs" <carefulbaza@gmail.com>', to: customer.email, subject: "Reenvio: Confirme a sua conta", html });
  res.json({ message: "E-mail reenviado!" });
});

app.post('/auth/login', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
    if (!customer || !await bcrypt.compare(req.body.password, customer.password)) return res.status(401).json({ error: "E-mail ou senha incorretos." });
    
    if (!customer.isVerified) return res.status(403).json({ error: "Por favor, confirme o seu e-mail antes de entrar.", needsVerification: true, email: customer.email });

    res.json({ token: jwt.sign({ customerId: customer.id }, JWT_SECRET, { expiresIn: '7d' }), user: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
  } catch (error) { res.status(500).json({ error: "Erro no servidor." }); }
});

// ==========================================
// RECUPERAÇÃO DE SENHA
// ==========================================
app.post('/auth/forgot-password', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
    if (!customer) return res.status(200).json({ message: "Se o e-mail existir na nossa base de dados, receberá um link de recuperação." });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.customer.update({ where: { email: customer.email }, data: { resetToken } });

    const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha?token=${resetToken}`;
    const html = baseEmailTemplate("Recuperação de Senha", "Recebemos um pedido para alterar a senha da sua conta. Se não foi você, ignore este e-mail.", "Redefinir Senha", link);
    
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail({ from: '"Careful Baza Labs" <carefulbaza@gmail.com>', to: customer.email, subject: "Redefinir a sua senha", html });
    } else {
      console.log(`🔗 TESTE LOCAL (REDEFINIR SENHA): ${link}`);
    }
    
    res.json({ message: "Se o e-mail existir na nossa base de dados, receberá um link de recuperação." });
  } catch (error) { res.status(500).json({ error: "Erro ao processar o pedido." }); }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const customer = await prisma.customer.findFirst({ where: { resetToken: token } });
    if (!customer) return res.status(400).json({ error: "Link de recuperação inválido ou expirado." });

    await prisma.customer.update({
      where: { id: customer.id },
      data: { password: await bcrypt.hash(newPassword, 10), resetToken: null }
    });

    res.json({ message: "Senha alterada com sucesso! Já pode fazer login." });
  } catch (error) { res.status(500).json({ error: "Erro ao alterar a senha." }); }
});

// ==========================================
// PAINEL DO CLIENTE E DEMONSTRAÇÃO
// ==========================================
app.put('/auth/profile', authenticateToken, async (req, res) => {
  const updatedCustomer = await prisma.customer.update({ where: { id: req.user.customerId }, data: { name: req.body.name, phone: req.body.phone } });
  res.json({ message: "Perfil atualizado!", user: { id: updatedCustomer.id, name: updatedCustomer.name, email: updatedCustomer.email, phone: updatedCustomer.phone } });
});

app.get('/my-orders', authenticateToken, async (req, res) => {
  const orders = await prisma.order.findMany({ where: { customerId: req.user.customerId }, include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
  res.json(orders.map(o => ({ ...o, totalAmount: o.totalAmount / 100, items: o.items.map(i => ({ ...i, price: i.price / 100 })) })));
});

app.post('/debug/create-test-order', authenticateToken, async (req, res) => {
  try {
    const product = await prisma.product.findFirst();
    if (!product) return res.status(400).json({ error: "Não há produtos na loja para criar o teste." });

    await prisma.order.create({
      data: {
        totalAmount: product.price,
        status: 'PAID',
        customerId: req.user.customerId,
        addressLine1: 'Rua do Teste de Luxo, 100',
        city: 'São Paulo',
        state: 'SP',                 
        zipCode: '01310-100',        
        trackingCode: `BZ${Math.floor(Math.random() * 1000000000)}BR`, 
        items: { create: [{ quantity: 1, price: product.price, productId: product.id }] }
      }
    });
    res.json({ message: "Pedido de teste gerado com sucesso!" });
  } catch (error) { 
    console.error("ERRO AO CRIAR PEDIDO DE TESTE:", error);
    res.status(500).json({ error: "Erro interno ao criar pedido." }); 
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`✅ Servidor a correr na porta ${PORT}`); });