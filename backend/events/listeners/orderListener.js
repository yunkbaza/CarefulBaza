const eventBus = require('../eventBus');
const prisma = require('../../config/prisma');
const { sendMail } = require('../../services/emailService');

// O "Ouvinte" fica à espera do evento de pagamento aprovado
eventBus.on('OrderPaid', async (session) => {
  try {
    console.log(`[EventBus] 📦 A processar pagamento aprovado do Stripe: ${session.id}`);

    // 1. Encontrar o e-mail do cliente na sessão do Stripe
    const customerEmail = session.customer_details?.email;
    if (!customerEmail) throw new Error("E-mail do cliente não encontrado na sessão.");

    // Procura o cliente, se não existir cria um (Guest Checkout)
    let customer = await prisma.customer.findUnique({ where: { email: customerEmail } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: customerEmail,
          name: session.customer_details?.name || "Cliente Convidado",
          isVerified: true // Comprou, logo o e-mail é válido
        }
      });
    }

    // 2. Criar o Pedido na Base de Dados (Prisma)
    const order = await prisma.order.create({
      data: {
        totalAmount: session.amount_total,
        status: "PAID",
        stripeId: session.id,
        customerId: customer.id,
        addressLine1: session.shipping_details?.address?.line1 || "",
        city: session.shipping_details?.address?.city || "",
        state: session.shipping_details?.address?.state || "",
        zipCode: session.shipping_details?.address?.postal_code || "",
        country: session.shipping_details?.address?.country || "BR",
      }
    });

    console.log(`[EventBus] ✅ Pedido ${order.id} guardado com sucesso!`);

    // 3. Enviar E-mail de Confirmação de Compra
    const valorFormatado = (session.amount_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: session.currency || 'BRL' });

    await sendMail(
      customer.email,
      "Pagamento Aprovado - Careful Baza",
      `Olá, ${customer.name}!`,
      `O seu pagamento no valor de ${valorFormatado} foi aprovado. O seu pedido de skincare já está a ser preparado.`,
      "Acompanhar Pedido",
      `${process.env.FRONTEND_URL}/rastreio`
    );

    console.log(`[EventBus] 📧 E-mail de confirmação enviado para: ${customer.email}`);

  } catch (error) {
    console.error(`[EventBus] 🔴 Falha ao processar OrderPaid:`, error.message);
  }
});