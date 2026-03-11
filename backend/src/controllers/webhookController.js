const stripe = require('../config/stripe');
const prisma = require('../config/prisma');

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`🔴 Falha no Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.client_reference_id; 
    const totalAmount = session.amount_total; 
    const stripeId = session.id;

    if (customerId && session.metadata?.cart) {
      try {
        const cartItems = JSON.parse(session.metadata.cart);
        await prisma.order.create({
          data: {
            totalAmount, status: "PAID", stripeId, customerId,
            items: {
              create: cartItems.map(item => ({
                quantity: item.quantity, price: Math.round(item.price * 100),
                product: { connect: { id: item.id } }
              }))
            }
          }
        });
        console.log(`🎉 Pedido salvo no Neon.`);
      } catch (dbError) { console.error(`🔴 Erro Prisma:`, dbError); }
    }
  }

  res.send();
};

module.exports = { handleStripeWebhook };