const prisma = require('../config/prisma');

const getMyOrders = async (req, res) => {
  try {
    // 1. CORREÇÃO: Pega o ID correto vindo do token de autenticação
    const customerId = req.user.id || req.user.customerId;

    if (!customerId) {
      return res.status(401).json({ error: "Usuário não identificado no token." });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: customerId }, // Agora ele sabe quem é o cliente!
      orderBy: { createdAt: 'desc' }, 
      include: { items: { include: { product: true } } }
    });

    const formattedOrders = orders.map(order => ({
      ...order,
      totalAmount: order.totalAmount / 100,
      items: order.items.map(item => ({ ...item, price: item.price / 100 }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("[OrderController] 🔴 Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Falha ao buscar o histórico." });
  }
};

// 🚀 NOVIDADE: Rastreio Público de Pedidos
const trackOrder = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Procura pelo ID do pedido (que vai no e-mail) ou pelo Código de Rastreio dos Correios
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: code },
          { trackingCode: code }
        ]
      },
      include: { items: { include: { product: true } } }
    });

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado. Verifique o código e tente novamente." });
    }

    // Formata os preços para não enviar em centavos
    const formattedOrder = {
      ...order,
      totalAmount: order.totalAmount / 100,
      items: order.items.map(item => ({ ...item, price: item.price / 100 }))
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error("[OrderController] Erro no rastreio:", error);
    res.status(500).json({ error: "Erro interno ao buscar o rastreio." });
  }
};

// Exportamos as DUAS funções para as rotas poderem usá-las
module.exports = { getMyOrders, trackOrder };