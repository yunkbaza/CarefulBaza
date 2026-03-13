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

module.exports = { getMyOrders };