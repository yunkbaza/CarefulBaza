const stripe = require('../config/stripe');
const eventBus = require('../events/eventBus');

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    // Usamos rawBody se existir (padrão de webhooks), senão cai para o body
    event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`🔴 Falha no Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🚀 REGRA DE OURO ENTERPRISE: Devolve 200 OK IMEDIATAMENTE para o Stripe não dar timeout
  res.status(200).send();

  // 🚀 EMITE O EVENTO E LIBERA A THREAD
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Dispara o evento apenas se o pagamento foi confirmado
    if (session.payment_status === 'paid') {
      eventBus.emit('OrderPaid', session);
    }
  }
};

module.exports = { handleStripeWebhook };