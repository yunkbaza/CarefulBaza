const stripe = require('../config/stripe');
const eventBus = require('../events/eventBus');

const handleStripeWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    // CORREÇÃO: Como configuramos express.raw() no app.js, o req.body JÁ É o buffer correto.
    // Usar apenas req.body garante que a assinatura do Stripe bata perfeitamente.
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`[Webhook] 🔴 Falha de Assinatura: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🚀 REGRA DE OURO ENTERPRISE: Devolve 200 OK IMEDIATAMENTE para o Stripe não dar timeout
  res.status(200).send();

  // 🚀 EMITE O EVENTO E LIBERA A THREAD
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Dispara o evento apenas se o pagamento foi confirmado
    if (session.payment_status === 'paid') {
      console.log(`[Webhook] 💰 Pagamento confirmado! A emitir OrderPaid para a sessão: ${session.id}`);
      eventBus.emit('OrderPaid', session);
    }
  }
};

module.exports = { handleStripeWebhook };