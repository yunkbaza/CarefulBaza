const prisma = require('../config/prisma');

const getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true } });
  res.json(products.map(p => ({ ...p, price: p.price / 100, compareAtPrice: p.compareAtPrice ? p.compareAtPrice / 100 : null })));
};

const getProductById = async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true } });
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json({ ...product, price: product.price / 100, compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null });
};

module.exports = { getAllProducts, getProductById };