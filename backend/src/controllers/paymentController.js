const stripe = require('../config/stripe');
const { getExchangeRate } = require('../services/currencyService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const createCheckoutSession = async (req, res) => {
  try {
    const { items, currency = 'usd', locale = 'pt', userId } = req.body; 
    
    const stripeLocales = { 'pt': 'pt-BR', 'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'ru': 'ru', 'zh': 'zh' };
    const stripeLocale = stripeLocales[locale] || 'auto';
    const rate = await getExchangeRate(currency);
    
    const lineItems = items.map((item) => {
      const priceInClientCurrency = item.price * rate;
      return {
        price_data: {
          currency: currency.toLowerCase(), 
          product_data: { name: item.name, images: [item.image] },
          unit_amount: Math.round(priceInClientCurrency * 100), 
        },
        quantity: item.quantity,
      };
    });

    const totalEmReais = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const FRETE_GRATIS_META_BRL = 250; 
    const valorFreteFixoBRL = 25.90;

    if (totalEmReais < FRETE_GRATIS_META_BRL) {
      const shippingInClientCurrency = valorFreteFixoBRL * rate;
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: 'Shipping / Frete' },
          unit_amount: Math.round(shippingInClientCurrency * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      locale: stripeLocale,
      client_reference_id: userId,
      metadata: { cart: JSON.stringify(items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))) },
      success_url: `${FRONTEND_URL}/checkout?status=success`,
      cancel_url: `${FRONTEND_URL}/checkout?status=error`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment with Stripe.' });
  }
};

module.exports = { createCheckoutSession };