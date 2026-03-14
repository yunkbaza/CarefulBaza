const eventBus = require('../eventBus');
const { sendMail } = require('../../services/emailService');

// 🎧 1. Ouvinte para Registo de Novo Utilizador
eventBus.on('UserRegistered', async (data) => {
  const { email, name, verificationToken, FRONTEND_URL } = data;

  try {
    console.log(`[EventBus] 📨 Iniciando envio assíncrono de e-mail (Boas-vindas) para: ${email}`);
    const link = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    
    await sendMail(
      email, 
      "Confirm your account - Careful Baza", 
      `Welcome, ${name}.`, 
      "Please confirm your email to activate your account.", 
      "Verify Email", 
      link
    );

    console.log(`[EventBus] ✅ E-mail de boas-vindas enviado com sucesso para: ${email}`);
  } catch (error) {
    console.error(`[EventBus] 🔴 Falha crítica ao enviar e-mail para ${email}:`, error.message);
    // 💡 Em produção (AWS SQS), a mensagem voltaria para a fila para ser tentada novamente (Retry Policy).
  }
});

// 🎧 2. Ouvinte para Reenvio de Confirmação
eventBus.on('VerificationResent', async (data) => {
  const { email, name, verificationToken, FRONTEND_URL } = data;

  try {
    console.log(`[EventBus] 📨 Iniciando envio assíncrono de e-mail (Reenvio) para: ${email}`);
    const link = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    
    await sendMail(
      email, 
      "Reenvio: Confirme a sua conta", 
      `Olá, ${name}.`, 
      "Por favor, confirme o seu e-mail.", 
      "Verificar E-mail", 
      link
    );

    console.log(`[EventBus] ✅ E-mail de reenvio enviado com sucesso para: ${email}`);
  } catch (error) {
    console.error(`[EventBus] 🔴 Falha crítica ao reenviar e-mail para ${email}:`, error.message);
  }
});

// 🎧 3. Ouvinte para Recuperação de Senha
eventBus.on('PasswordResetRequested', async (data) => {
  const { email, name, resetToken, FRONTEND_URL } = data;

  try {
    console.log(`[EventBus] 📨 Iniciando envio assíncrono de e-mail (Recuperação) para: ${email}`);
    const link = `${FRONTEND_URL}/redefinir-senha?token=${resetToken}`;
    
    await sendMail(
      email, 
      "Recuperação de Senha - CarefulBaza", 
      `Olá, ${name}.`, 
      "Recebemos um pedido para redefinir a sua senha. Se não foi você, ignore este e-mail.", 
      "Criar Nova Senha", 
      link
    );

    console.log(`[EventBus] ✅ E-mail de recuperação enviado com sucesso para: ${email}`);
  } catch (error) {
    console.error(`[EventBus] 🔴 Falha crítica ao enviar recuperação de senha para ${email}:`, error.message);
  }
});

// 🚀 🎧 4. Ouvinte para Confirmação de Pagamento (SAGA PATTERN)
eventBus.on('PaymentConfirmationEmailRequested', async (data) => {
  const { email, name, valorFormatado } = data;

  try {
    console.log(`[EventBus] 📨 Iniciando envio assíncrono de e-mail (Pagamento) para: ${email}`);
    
    const frontendUrl = process.env.FRONTEND_URL || 'https://carefulbaza.vercel.app';
    
    await sendMail(
      email,
      "Pagamento Aprovado - Carefulbaza",
      `Olá, ${name || 'Cliente'}!`,
      `O seu pagamento no valor de ${valorFormatado} foi aprovado. O seu pedido já está a ser preparado.`,
      "Acompanhar Pedido",
      `${frontendUrl}/minha-conta`
    );

    console.log(`[EventBus] ✅ E-mail de pagamento enviado com sucesso para: ${email}`);
  } catch (error) {
    console.error(`[EventBus] 🔴 Falha crítica ao enviar e-mail de pagamento para ${email}:`, error.message);
  }
});