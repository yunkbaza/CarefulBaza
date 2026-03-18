const eventBus = require('../eventBus');
const prisma = require('../../config/prisma');

/**
 * 🎧 OUVINTE: OrderPaid (Confirmado pelo Stripe Webhook)
 * SAGA PATTERN: Passo 2 - Persistência do Pedido no Banco de Dados
 */
eventBus.on('OrderPaid', async (session) => {
  try {
    console.log(`[Saga - Order] 📥 Processando pedido para a sessão Stripe: ${session.id}`);

    const customerEmail = session.customer_details?.email;
    if (!customerEmail) throw new Error("E-mail do cliente não encontrado.");

    // 1. Garantir que o cliente (Customer) existe no banco
    let customer = await prisma.customer.findUnique({ where: { email: customerEmail } });
    
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: customerEmail,
          name: session.customer_details?.name || "Cliente",
          isVerified: true // Se pagou, o e-mail é válido
        }
      });
    }

    // 2. Processar os itens do carrinho vindos do Metadata
    let cartItemsToCreate = [];
    if (session.metadata?.cart) {
      const cart = JSON.parse(session.metadata.cart);
      
      for (const item of cart) {
        // Buscamos o produto no banco para pegar o preço e garantir integridade
        const product = await prisma.product.findUnique({ where: { id: item.id } });
        if (product) {
          cartItemsToCreate.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.price // Preço capturado no momento da venda (em centavos)
          });
        }
      }
    }

    // 3. Criar o Pedido (Order) e seus Itens (OrderItem) no PostgreSQL
    // Mapeamento corrigido para os nomes de campos do seu schema.prisma
    const order = await prisma.order.create({
      data: {
        totalAmount: session.amount_total, // Valor total em centavos
        status: "PAID",
        stripeId: session.id,
        customerId: customer.id,
        
        // Dados de Entrega coletados pelo Stripe
        addressLine1: session.shipping_details?.address?.line1 || "Não informado",
        city: session.shipping_details?.address?.city || "Não informado",
        state: session.shipping_details?.address?.state || "Não informado",
        zipCode: session.shipping_details?.address?.postal_code || "Não informado",
        country: session.shipping_details?.address?.country || "BR",
        
        // Relacionamento com itens do pedido
        items: {
          create: cartItemsToCreate 
        }
      }
    });

    console.log(`[Saga - Order] ✅ Pedido ${order.id} salvo com sucesso no banco.`);

    // 🚀 ORQUESTRAÇÃO: Disparar próximos passos da Saga
    
    // A) Notificação por e-mail
    const currencyCode = (session.currency || 'BRL').toUpperCase();
    const valorFormatado = (session.amount_total / 100).toLocaleString('pt-BR', { 
      style: 'currency', currency: currencyCode 
    });
    
    eventBus.emit('PaymentConfirmationEmailRequested', {
        email: customer.email,
        name: customer.name,
        valorFormatado,
        orderId: order.id // Passamos o ID para o e-mail ter link de rastreio
    });

    // B) Sinal para Logística/Dropshipping (AliExpress/Zendrop)
    eventBus.emit('OrderFulfillmentStarted', { 
        orderId: order.id, 
        customerId: customer.id 
    });

  } catch (error) {
    console.error(`[Saga - Order] 🔴 FALHA CRÍTICA ao processar pedido:`, error.message);
  }
});

module.exports = {};