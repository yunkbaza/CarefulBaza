const eventBus = require('../eventBus');
const { sendMail } = require('../../services/emailService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://carefulbaza.vercel.app';

/**
 * 🎧 1. OUVINTE: NOVO REGISTO (Boas-vindas + Verificação)
 */
eventBus.on('UserRegistered', async (data) => {
  const { email, name, verificationToken } = data;

  try {
    console.log(`[EmailListener] 📨 A preparar e-mail de boas-vindas para: ${email}`);
    const link = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    
    await sendMail(
      email, 
      "Bem-vindo à Careful Baza - Confirme a sua conta", 
      `Olá, ${name}!`, 
      "Estamos muito felizes por ter você connosco. Para começar a explorar a nossa curadoria exclusiva, por favor confirme o seu e-mail abaixo.", 
      "Confirmar Minha Conta", 
      link
    );

    console.log(`[EmailListener] ✅ E-mail de boas-vindas enviado para: ${email}`);
  } catch (error) {
    console.error(`[EmailListener] 🔴 Erro ao enviar boas-vindas para ${email}:`, error.message);
  }
});

/**
 * 🎧 2. OUVINTE: REENVIO DE CONFIRMAÇÃO
 */
eventBus.on('VerificationResent', async (data) => {
  const { email, name, verificationToken } = data;

  try {
    const link = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    
    await sendMail(
      email, 
      "Verificação de E-mail - Careful Baza", 
      `Olá, ${name}.`, 
      "Aqui está o novo link que solicitou para confirmar a sua conta.", 
      "Verificar Agora", 
      link
    );
    console.log(`[EmailListener] ✅ E-mail de reenvio enviado para: ${email}`);
  } catch (error) {
    console.error(`[EmailListener] 🔴 Erro no reenvio para ${email}:`, error.message);
  }
});

/**
 * 🎧 3. OUVINTE: RECUPERAÇÃO DE SENHA
 */
eventBus.on('PasswordResetRequested', async (data) => {
  const { email, name, resetToken } = data;

  try {
    const link = `${FRONTEND_URL}/redefinir-senha?token=${resetToken}`;
    
    await sendMail(
      email, 
      "Recuperação de Acesso - Careful Baza", 
      `Olá, ${name}.`, 
      "Recebemos um pedido para redefinir a sua senha. Se não realizou este pedido, por favor ignore este e-mail por segurança.", 
      "Criar Nova Senha", 
      link
    );
    console.log(`[EmailListener] ✅ Instruções de senha enviadas para: ${email}`);
  } catch (error) {
    console.error(`[EmailListener] 🔴 Erro na recuperação de senha para ${email}:`, error.message);
  }
});

/**
 * 🚀 🎧 4. OUVINTE: PAGAMENTO APROVADO (SAGA PATTERN)
 */
eventBus.on('PaymentConfirmationEmailRequested', async (data) => {
  const { email, name, valorFormatado, orderId } = data;

  try {
    console.log(`[EmailListener] 💰 A preparar confirmação de pagamento para: ${email}`);
    
    // Se tivermos o ID do pedido, mandamos para o rastreio específico, senão para a conta
    const trackingLink = orderId 
      ? `${FRONTEND_URL}/rastreio?code=${orderId}`
      : `${FRONTEND_URL}/minha-conta`;

    await sendMail(
      email,
      "Pagamento Aprovado - O seu pedido está a caminho!",
      `Olá, ${name || 'Cliente Careful Baza'}!`,
      `Confirmamos o recebimento do seu pagamento no valor de ${valorFormatado}. A nossa equipa já iniciou o processo de preparação e envio do seu pedido.`,
      "Acompanhar Meu Pedido",
      trackingLink
    );

    console.log(`[EmailListener] ✅ E-mail de pagamento confirmado enviado para: ${email}`);
  } catch (error) {
    console.error(`[EmailListener] 🔴 Erro ao confirmar pagamento para ${email}:`, error.message);
  }
});

module.exports = {}; // O require no app.js já ativa os ouvintes