const stripe = require('../config/stripe');
const { getExchangeRate } = require('../services/currencyService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const createCheckoutSession = async (req, res) => {
  try {
    // 🛡️ Extraímos os dados enviados pelo CheckoutPage.jsx
    const { items, currency = 'brl', locale = 'pt', userId, customerEmail } = req.body; 
    
    // Mapeamento de idiomas para o Stripe
    const stripeLocales = { 'pt': 'pt-BR', 'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'ru': 'ru', 'zh': 'zh' };
    const stripeLocale = stripeLocales[locale] || 'auto';
    
    // 💱 Busca a taxa de câmbio (BRL -> Moeda do Cliente)
    const rate = await getExchangeRate(currency);
    
    // 1. Prepara os produtos para o Stripe
    const lineItems = items.map((item) => {
      // item.price já vem em decimal (ex: 89.90) do banco/Dynamo
      const priceInClientCurrency = item.price * rate;
      
      return {
        price_data: {
          currency: currency.toLowerCase(), 
          product_data: { 
            name: item.name, 
            images: item.image ? [item.image] : [] 
          },
          // ⚠️ unit_amount deve ser um INTEIRO representando centavos
          unit_amount: Math.round(priceInClientCurrency * 100), 
        },
        quantity: item.quantity,
      };
    });

    // 🚚 LÓGICA DE FRETE (Baseada no total do carrinho em BRL)
    const totalEmReais = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const FRETE_GRATIS_META_BRL = 250; 
    const valorFreteFixoBRL = 25.90;

    if (totalEmReais < FRETE_GRATIS_META_BRL) {
      const shippingInClientCurrency = valorFreteFixoBRL * rate;
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { 
            name: 'Frete Internacional / Shipping',
            description: 'Entrega segura com código de rastreio'
          },
          unit_amount: Math.round(shippingInClientCurrency * 100),
        },
        quantity: 1,
      });
    }

    // 2. Configuração da Sessão do Stripe
    const sessionConfig = {
      line_items: lineItems,
      mode: 'payment',
      locale: stripeLocale,
      client_reference_id: userId,
      
      // 📍 Coleta automática de endereço (Necessário para o dropshipping)
      shipping_address_collection: {
        allowed_countries: ['BR', 'PT', 'US', 'GB', 'FR', 'DE', 'ES', 'IT', 'CA'],
      },

      // 🛡️ METADATA CORRIGIDO
      metadata: { 
        // 🚨 IMPORTANTE: O ID deve ir COMPLETO para o orderListener.js conseguir
        // fazer o findUnique no banco de dados depois!
        cart: JSON.stringify(items.map(i => ({ id: i.id, quantity: i.quantity }))).substring(0, 500)
      },

      success_url: `${FRONTEND_URL}/checkout?status=success`,
      cancel_url: `${FRONTEND_URL}/checkout?status=error`,
    };

    // Preenche e-mail se disponível
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url });

  } catch (error) {
    console.error('[Stripe] Falha ao criar sessão:', error.message);
    res.status(500).json({ error: 'Falha ao processar pagamento.' });
  }
};

module.exports = { createCheckoutSession };