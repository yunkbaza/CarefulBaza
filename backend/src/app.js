const express = require('express');
const cors = require('cors');

// 📦 Importação das rotas
const webhookRoutes = require('./routes/webhookRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// ⏰ Importação do Job de Sincronização (Corrigido o caminho!)
// Apenas fazer o require já registra o agendamento do cron
require('./jobs/priceSyncJob');

// 🔔 Acorda os listeners (Event Bus)
require('./events/listeners/emailListener');
require('./events/listeners/orderListener');

const app = express();

// 1. 🛡️ CONFIGURAÇÃO DE CORS
// Colocado no topo para evitar que o navegador bloqueie as requisições
app.use(cors({
  origin: ['http://localhost:5173', 'https://carefulbaza.vercel.app'],
  credentials: true
}));

// 2. ⚡ WEBHOOK DO STRIPE (MUITO IMPORTANTE)
// Deve vir ANTES do express.json() porque o Stripe precisa dos dados "crus" (Buffer)
// para verificar a assinatura digital da transação.
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// 3. ⚙️ MIDDLEWARES GLOBAIS
// Agora sim, transformamos o resto das requisições em JSON
app.use(express.json());

// 4. 🚀 ROTA RAIZ (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "online", 
    message: "API da CarefulBaza está no ar! 🚀",
    timestamp: new Date().toISOString()
  });
});

// 5. 🛤️ ROTAS DA API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', aiRoutes);      // Ex: /api/chat
app.use('/api', orderRoutes);   // Ex: /api/my-orders
app.use('/api', paymentRoutes); // Ex: /api/checkout

module.exports = app;