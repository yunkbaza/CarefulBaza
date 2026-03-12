const eventBus = require('../eventBus');
const { sendMail } = require('../../services/emailService');

// O "Ouvinte" fica o tempo todo esperando alguém disparar o evento 'UserRegistered'
eventBus.on('UserRegistered', async (data) => {
  const { email, name, verificationToken, FRONTEND_URL } = data;

  try {
    console.log(`[EventBus] 📨 Iniciando envio assíncrono de e-mail para: ${email}`);
    
    const link = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    
    await sendMail(
      email, 
      "Confirm your account - Careful Baza", 
      `Welcome, ${name}.`, 
      "Please confirm your email to activate your account.", 
      "Verify Email", 
      link
    );

    console.log(`[EventBus] ✅ E-mail enviado com sucesso para: ${email}`);
  } catch (error) {
    console.error(`[EventBus] 🔴 Falha crítica ao enviar e-mail para ${email}:`, error.message);
    // 💡 Dica Sênior: Se falhar, a API do cliente não quebra. Aqui poderíamos salvar o e-mail num banco de dados para tentar de novo mais tarde (Dead Letter Queue).
  }
});