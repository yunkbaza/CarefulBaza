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

app.use(cors());app.use(cors({
  origin: ['http://localhost:5173', 'https://carefulbaza.vercel.app'],
  credentials: true
}));
// 🚨 IMPORTANTE: O Webhook do Stripe precisa do corpo bruto (raw) ANTES do express.json()
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// Para todas as outras rotas, usamos JSON
app.use(express.json());

// Montagem das rotas
app.use('/api', aiRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/', orderRoutes); // as rotas de my-orders
app.use('/', paymentRoutes); // as rotas de checkout

module.exports = app;