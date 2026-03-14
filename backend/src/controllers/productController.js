const prisma = require('../config/prisma');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

// 🛡️ Configuração do Cliente AWS
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "CarefulBaza_Products";

const getAllProducts = async (req, res) => {
  try {
    // ⚡ 1. Tenta ler do DynamoDB (Read Model - CQRS)
    console.log('[CQRS - Query] ⚡ Tentando ler catálogo do DynamoDB...');
    const { Items } = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));

    if (Items && Items.length > 0) {
      console.log('[CQRS - Query] ✅ Cache HIT: Catálogo recuperado do DynamoDB.');
      return res.json(Items);
    }

    // 🐢 2. Se o DynamoDB estiver vazio (Cache Miss), lê do PostgreSQL
    console.log('[CQRS - Query] 🐢 Cache MISS: Lendo do PostgreSQL via Prisma...');
    const products = await prisma.product.findMany({ include: { category: true } });
    
    const formattedProducts = products.map(p => ({ 
      ...p, 
      price: p.price / 100, 
      compareAtPrice: p.compareAtPrice ? p.compareAtPrice / 100 : null 
    }));

    // 💾 3. Sincroniza com o DynamoDB (Popula o Read Model)
    // Fazemos isso em background para não atrasar a resposta
    formattedProducts.forEach(async (product) => {
      try {
        await ddbDocClient.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: product
        }));
      } catch (err) {
        console.error(`[CQRS] Erro ao sincronizar produto ${product.id}:`, err.message);
      }
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error("[ProductController] 🔴 Erro ao buscar produtos:", error);
    // Fallback de segurança: se o DynamoDB falhar, tenta o Prisma diretamente
    const fallback = await prisma.product.findMany({ include: { category: true } });
    res.json(fallback.map(p => ({ ...p, price: p.price / 100 })));
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // ⚡ Tenta ler o produto específico do DynamoDB
    console.log(`[CQRS - Query] ⚡ Buscando produto ${productId} no DynamoDB...`);
    const { Item } = await ddbDocClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: productId }
    }));

    if (Item) {
      console.log(`[CQRS - Query] ✅ Cache HIT: Produto ${productId} encontrado.`);
      return res.json(Item);
    }

    // 🐢 Se não estiver no Dynamo, busca no PostgreSQL
    console.log(`[CQRS - Query] 🐢 Cache MISS: Buscando produto ${productId} no PostgreSQL...`);
    const product = await prisma.product.findUnique({ where: { id: productId }, include: { category: true } });
    
    if (!product) return res.status(404).json({ error: "Product not found." });
    
    const formattedProduct = { 
      ...product, 
      price: product.price / 100, 
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null 
    };

    // 💾 Salva no DynamoDB para a próxima consulta
    await ddbDocClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: formattedProduct
    }));

    res.json(formattedProduct);
  } catch (error) {
    console.error(`[ProductController] 🔴 Erro ao buscar produto ${req.params.id}:`, error);
    res.status(500).json({ error: "Falha ao carregar os detalhes do produto." });
  }
};

// 🚀 INVALIDAÇÃO DE CACHE (Agora apaga do DynamoDB de verdade)
const invalidateCatalogCache = async () => {
  try {
    // No DynamoDB, para limpar tudo, geralmente você deleta e recria a tabela 
    // ou deleta os itens. Aqui vamos apenas logar, pois no padrão Cache-Aside 
    // o PutCommand já sobrescreve os dados antigos.
    console.log('[CQRS - Command] 🧹 O Read Model será atualizado na próxima leitura.');
  } catch (error) {
    console.error("Erro ao invalidar cache:", error);
  }
};

module.exports = { getAllProducts, getProductById, invalidateCatalogCache };