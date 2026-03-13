const eventBus = require('../eventBus');
const prisma = require('../../config/prisma');
const { sendMail } = require('../../services/emailService');

eventBus.on('OrderPaid', async (session) => {
  try {
    const customerEmail = session.customer_details?.email;
    if (!customerEmail) throw new Error("E-mail não encontrado na sessão.");

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

    // 🚀 NOVIDADE: Lemos o carrinho do Stripe e preparamos os produtos para o Prisma
    let cartItemsToCreate = [];
    if (session.metadata?.cart) {
      const cart = JSON.parse(session.metadata.cart);
      
      // Busca o preço atualizado de cada produto para garantir integridade
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

    // 2. Criar o Pedido com os Itens dentro!
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
        
        // 🚀 MÁGICA AQUI: O Prisma já cria o pedido e insere os produtos na tabela OrderItem
        items: {
          create: cartItemsToCreate 
        }
      }
    });

    console.log(`[EventBus] ✅ Pedido ${order.id} com ${cartItemsToCreate.length} itens guardado!`);

    const currencyCode = (session.currency || 'BRL').toUpperCase();
    const valorFormatado = (session.amount_total / 100).toLocaleString('pt-BR', { 
      style: 'currency', currency: currencyCode 
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://carefulbaza.vercel.app';

    await sendMail(
      customer.email,
      "Pagamento Aprovado - Carefulbaza",
      `Olá, ${customer.name || 'Cliente'}!`,
      `O seu pagamento no valor de ${valorFormatado} foi aprovado. O seu pedido já está a ser preparado.`,
      "Acompanhar Pedido",
      `${frontendUrl}/my-orders`
    );

  } catch (error) {
    console.error(`[EventBus] 🔴 Falha ao processar OrderPaid:`, error.message);
  }
});