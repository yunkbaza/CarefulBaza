const express = require('express');
const cors = require('cors');

// Importação das rotas
const webhookRoutes = require('./routes/webhookRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Acorda os listeners (Importante estarem aqui para ouvirem o eventBus!)
require('./events/listeners/emailListener');
require('./events/listeners/orderListener');

const app = express();

// 1. CORREÇÃO DE CORS: Apenas uma chamada, bem definida, no topo da cadeia.
app.use(cors({
  origin: ['http://localhost:5173', 'https://carefulbaza.vercel.app'],
  credentials: true
}));

// 2. Webhook do Stripe (MUITO IMPORTANTE: Sempre ANTES do express.json)
// O express.raw garante que o webhookController receba os dados crus (Buffer)
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// 3. Middlewares Globais
// Transforma o body das rotas seguintes em JSON
app.use(express.json());

// 4. Rota Raiz (Teste de Saúde)
app.get('/', (req, res) => {
  res.status(200).json({ status: "online", message: "API da CarefulBaza está no ar na AWS! 🚀" });
});

// 5. Rotas da API
app.use('/api', aiRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', orderRoutes); // as rotas de my-orders
app.use('/api', paymentRoutes); // as rotas de checkout

module.exports = app;