require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
// Inicializamos o Stripe com a chave que está no .env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middlewares
app.use(cors()); // Permite que o seu Front-end faça pedidos a este servidor
app.use(express.json()); // Permite que o servidor entenda dados em JSON

// Rota de Teste para vermos se está online
app.get('/', (req, res) => {
  res.send('API da Careful Baza Labs está a funcionar! 🚀');
});

// A Rota Principal de Pagamento
app.post('/create-checkout-session', async (req, res) => {
  try {
    // Recebemos o carrinho enviado pelo Front-end (React)
    const { items } = req.body; 

    // Convertemos os produtos para o formato rigoroso do Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        // O Stripe lida com cêntimos. R$ 189,90 tem de ser enviado como 18990
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }));

    // Pedimos ao Stripe para gerar a sessão de pagamento
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'], // Pode adicionar 'pix' se o Stripe ativar para si
      line_items: lineItems,
      mode: 'payment',
      // Redirecionamentos para quando o cliente paga ou desiste
      success_url: 'http://localhost:5173/checkout?status=success',
      cancel_url: 'http://localhost:5173/checkout?status=error',
    });

    // Devolvemos o link do ecrã de pagamento do Stripe para o React
    res.json({ url: session.url });

  } catch (error) {
    console.error("Erro ao criar sessão do Stripe:", error);
    res.status(500).json({ error: 'Falha ao processar o pagamento.' });
  }
});

// Ligar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});