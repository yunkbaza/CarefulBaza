const express = require('express');
const cors = require('cors');

// Importação das rotas
const webhookRoutes = require('./routes/webhookRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

require('./events/listeners/emailListener');
require('./events/listeners/orderListener');

const app = express();

// 1. CORREÇÃO DE CORS: Apenas uma chamada, bem definida.
app.use(cors({
  origin: ['http://localhost:5173', 'https://carefulbaza.vercel.app'],
  credentials: true
}));

// 2. Webhook do Stripe (Sempre ANTES do express.json)
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// 3. Middlewares Globais
app.use(express.json());

// 4. Rota Raiz (Teste de Saúde para ver se o servidor está vivo)
app.get('/', (req, res) => {
  res.status(200).json({ status: "online", message: "API da CarefulBaza está no ar na AWS! 🚀" });
});

// 5. CORREÇÃO DAS ROTAS (Todas agora respondem dentro de /api)
app.use('/api', aiRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', orderRoutes); // as rotas de my-orders
app.use('/api', paymentRoutes); // as rotas de checkout

module.exports = app;