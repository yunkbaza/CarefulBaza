require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { 
  console.log(`✅ Servidor Global a rodar na porta ${PORT} com Arquitetura Modular!`); 
});