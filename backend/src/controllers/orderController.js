const prisma = require('../config/prisma');

const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.customerId },
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
    res.status(500).json({ error: "Falha ao buscar o histórico." });
  }
};

module.exports = { getMyOrders };