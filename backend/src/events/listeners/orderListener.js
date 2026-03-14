const eventBus = require('../eventBus');
const prisma = require('../../config/prisma');
// 🚨 O emailService foi removido daqui! O Listener de Pedidos agora é 100% focado no Banco de Dados.

// 🛡️ SAGA PATTERN: Passo 2 - Comando de Escrita e Orquestração
eventBus.on('OrderPaid', async (session) => {
  try {
    console.log(`[Saga - Order] 📥 Recebido evento OrderPaid do Webhook. Processando sessão: ${session.id}`);

    const customerEmail = session.customer_details?.email;
    if (!customerEmail) throw new Error("E-mail não encontrado na sessão.");

    // 1. Garantir que o cliente existe
    let customer = await prisma.customer.findUnique({ where: { email: customerEmail } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: customerEmail,
          name: session.customer_details?.name || "Cliente Convidado",
          isVerified: true
        }
      });
    }

    // 2. Preparar itens do carrinho
    let cartItemsToCreate = [];
    if (session.metadata?.cart) {
      const cart = JSON.parse(session.metadata.cart);
      
      for (const item of cart) {
        const product = await prisma.product.findUnique({ where: { id: item.id } });
        if (product) {
          cartItemsToCreate.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.price // Guarda o preço exato que o cliente pagou
          });
        }
      }
    }

    // ⚡ COMMAND: Alteração de Estado (Lado da Escrita - CQRS)
    const order = await prisma.order.create({
      data: {
        totalAmount: session.amount_total,
        status: "PAID",
        stripeId: session.id,
        customerId: customer.id,
        addressLine1: session.shipping_details?.address?.line1 || "Não informado",
        city: session.shipping_details?.address?.city || "Não informado",
        state: session.shipping_details?.address?.state || "Não informado",
        zipCode: session.shipping_details?.address?.postal_code || "Não informado",
        country: session.shipping_details?.address?.country || "BR",
        items: {
          create: cartItemsToCreate 
        }
      }
    });

    console.log(`[Saga - Order] ✅ Comando Executado: Pedido ${order.id} com ${cartItemsToCreate.length} itens criado!`);

    // 🚀 SAGA PATTERN: Passo 3 - Orquestração e Desacoplamento

    // A) Avisamos o Serviço de Notificações para enviar o e-mail de confirmação (Assíncrono)
    const currencyCode = (session.currency || 'BRL').toUpperCase();
    const valorFormatado = (session.amount_total / 100).toLocaleString('pt-BR', { 
      style: 'currency', currency: currencyCode 
    });
    
    eventBus.emit('PaymentConfirmationEmailRequested', {
        email: customer.email,
        name: customer.name,
        valorFormatado
    });

    // B) Avisamos a Logística que o pedido está pronto para ser separado/enviado
    eventBus.emit('OrderFulfillmentStarted', { orderId: order.id, customerId: customer.id });

  } catch (error) {
    console.error(`[Saga - Order] 🔴 Falha Crítica ao processar OrderPaid:`, error.message);
    // 💡 Em uma arquitetura como a do Itaú, enviaríamos este erro para uma DLQ (Dead Letter Queue) no RabbitMQ.
  }
});