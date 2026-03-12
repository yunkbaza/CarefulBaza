require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// 🚀 AJUSTE DE DEVOPS: O '0.0.0.0' diz ao Docker para aceitar conexões da AWS!
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`✅ Servidor Global a rodar na porta ${PORT} com Arquitetura Modular!`); 
});