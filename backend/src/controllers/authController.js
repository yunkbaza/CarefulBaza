const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 
const prisma = require('../config/prisma');
const eventBus = require('../events/eventBus'); 
const { sendMail } = require('../services/emailService'); // 👈 Importa o disparador de e-mails

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://carefulbaza.vercel.app';
const JWT_SECRET = process.env.JWT_SECRET || 'careful_baza_super_secret_key';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await prisma.customer.findUnique({ where: { email } })) return res.status(400).json({ error: "Email already registered." });

    const verificationToken = crypto.randomBytes(32).toString('hex'); 
    
    await prisma.customer.create({
      data: { name, email, password: await bcrypt.hash(password, 10), verificationToken }
    });

    eventBus.emit('UserRegistered', { email, name, verificationToken, FRONTEND_URL });

    res.json({ message: "Account created! Please check your email." });
  } catch (error) { res.status(500).json({ error: "Error creating account." }); }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return res.status(404).json({ error: "User not found." });
    if (customer.isVerified) return res.status(400).json({ error: "Already verified." });

    const verificationToken = crypto.randomBytes(32).toString('hex'); 
    await prisma.customer.update({ where: { id: customer.id }, data: { verificationToken } });

    const link = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    await sendMail(email, "Reenvio: Confirme a sua conta", `Olá, ${customer.name}.`, "Por favor, confirme o seu e-mail.", "Verificar E-mail", link);

    res.json({ message: "Email resent successfully!" });
  } catch (error) { res.status(500).json({ error: "Server error." }); }
};

const verifyEmail = async (req, res) => {
  const customer = await prisma.customer.findFirst({ where: { verificationToken: req.body.token } });
  if (!customer) return res.status(400).json({ error: "Invalid link." });
  await prisma.customer.update({ where: { id: customer.id }, data: { isVerified: true, verificationToken: null } });
  res.json({ message: "Email successfully verified!" });
};

const login = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { email: req.body.email } });
    if (!customer || !await bcrypt.compare(req.body.password, customer.password)) return res.status(401).json({ error: "Incorrect credentials." });
    if (!customer.isVerified) return res.status(403).json({ error: "Please verify email.", needsVerification: true, email: customer.email });

    // Usa sempre o id padrão do Prisma
    const token = jwt.sign({ id: customer.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
  } catch (error) { res.status(500).json({ error: "Server error." }); }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const customerId = req.user.id || req.user.customerId;
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: { name, phone }
    });
    res.json({ user: { id: updatedCustomer.id, name: updatedCustomer.name, email: updatedCustomer.email, phone: updatedCustomer.phone } });
  } catch (error) { res.status(500).json({ error: "Failed to save data." }); }
};

// 🚀 O cliente pediu para recuperar a senha
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await prisma.customer.findUnique({ where: { email } });
    
    // Por segurança, não avisamos se o e-mail não existe (evita que hackers descubram quem tem conta)
    if (!customer) return res.status(200).json({ message: "Se o e-mail existir, você receberá um link." });

    // Gera um código único e salva no banco de dados
    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.customer.update({ where: { id: customer.id }, data: { resetToken } });

    // Dispara o e-mail
    const link = `${FRONTEND_URL}/redefinir-senha?token=${resetToken}`;
    await sendMail(
      email, 
      "Recuperação de Senha - CarefulBaza", 
      `Olá, ${customer.name}.`, 
      "Recebemos um pedido para redefinir a sua senha. Se não foi você, ignore este e-mail.", 
      "Criar Nova Senha", 
      link
    );

    res.status(200).json({ message: "Se o e-mail existir, você receberá um link." });
  } catch (error) {
    console.error("[Auth] Erro no forgotPassword:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

// 🚀 O cliente clicou no e-mail e digitou a senha nova
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Procura quem é o dono desse token
    const customer = await prisma.customer.findFirst({ where: { resetToken: token } });
    if (!customer) return res.status(400).json({ error: "Link de redefinição inválido ou expirado." });

    // Criptografa a nova senha e apaga o token de segurança
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.customer.update({
      where: { id: customer.id },
      data: { password: hashedPassword, resetToken: null }
    });

    res.status(200).json({ message: "Senha atualizada com sucesso! Já pode fazer login." });
  } catch (error) {
    console.error("[Auth] Erro no resetPassword:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

// Exporta todas as funções para as rotas
module.exports = { register, resendVerification, verifyEmail, login, updateProfile, forgotPassword, resetPassword };