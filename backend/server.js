require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

/**
 * 🚀 CONFIGURAÇÃO DE DEVOPS (AWS & DOCKER)
 * O uso de '0.0.0.0' em vez de 'localhost' é vital para que o tráfego 
 * externo da AWS consiga atravessar o container Docker e chegar à sua API.
 */
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`-----------------------------------------------------------`);
  console.log(`✅ BAZA SERVER: ONLINE E GLOBAL (Arquitetura Modular)`);
  console.log(`🚀 Porta: ${PORT}`);
  console.log(`🌐 Host: 0.0.0.0 (Pronto para AWS / Docker / Vercel)`);
  console.log(`⏰ Automação: Sincronização AliExpress Agendada (03:00 AM)`);
  console.log(`-----------------------------------------------------------`);
});