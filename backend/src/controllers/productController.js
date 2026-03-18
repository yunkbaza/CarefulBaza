const prisma = require('../config/prisma');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

// 📦 Importação do serviço do AliExpress
const aliexpressService = require('../services/aliexpressService');

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

/**
 * ⚡ BUSCAR TODOS OS PRODUTOS (CQRS - Read Model)
 */
const getAllProducts = async (req, res) => {
  try {
    console.log('[CQRS - Query] ⚡ Tentando ler catálogo do DynamoDB...');
    const { Items } = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));

    if (Items && Items.length > 0) {
      console.log('[CQRS - Query] ✅ Cache HIT: Catálogo recuperado do DynamoDB.');
      return res.json(Items);
    }

    console.log('[CQRS - Query] 🐢 Cache MISS: Lendo do PostgreSQL via Prisma...');
    const products = await prisma.product.findMany({ include: { category: true } });
    
    const formattedProducts = products.map(p => ({ 
      ...p, 
      price: p.price / 100, 
      compareAtPrice: p.compareAtPrice ? p.compareAtPrice / 100 : null,
      // 📅 Garantia de data em String para o DynamoDB
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt
    }));

    // Sincronização em background
    formattedProducts.forEach(async (product) => {
      try {
        await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: product }));
      } catch (err) {
        console.error(`[CQRS] Erro ao sincronizar produto ${product.id}:`, err.message);
      }
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error("[ProductController] 🔴 Erro ao buscar produtos:", error);
    const fallback = await prisma.product.findMany({ include: { category: true } });
    res.json(fallback.map(p => ({ ...p, price: p.price / 100 })));
  }
};

/**
 * 🔍 BUSCAR PRODUTO POR ID
 */
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const { Item } = await ddbDocClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: productId }
    }));

    if (Item) {
      console.log(`[CQRS - Query] ✅ Cache HIT: Produto ${productId} encontrado.`);
      return res.json(Item);
    }

    const product = await prisma.product.findUnique({ 
      where: { id: productId }, 
      include: { category: true } 
    });
    
    if (!product) return res.status(404).json({ error: "Product not found." });
    
    const formattedProduct = { 
      ...product, 
      price: product.price / 100, 
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null,
      createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
      updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt
    };

    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: formattedProduct }));
    res.json(formattedProduct);
  } catch (error) {
    console.error(`[ProductController] 🔴 Erro ao buscar produto ${req.params.id}:`, error);
    res.status(500).json({ error: "Falha ao carregar os detalhes do produto." });
  }
};

/**
 * 🚀 IMPORTADOR AUTOMÁTICO DO ALIEXPRESS (Com Validação de Duplicados)
 */
const importFromAliExpress = async (req, res) => {
  try {
    const { aliExpressId, categoryId } = req.body;

    if (!aliExpressId) {
      return res.status(400).json({ error: "O ID do produto do AliExpress é obrigatório." });
    }

    // 🛡️ PASSO 2: Verificação de Integridade (Evita Duplicados)
    // Procuramos no banco se este aliExpressId já existe
    const existingProduct = await prisma.product.findFirst({
      where: { aliExpressId: aliExpressId.toString() }
    });

    if (existingProduct) {
      return res.status(409).json({ 
        error: "Este produto já existe no seu catálogo.",
        product: existingProduct 
      });
    }

    // 1. Busca os dados no serviço (ou Mock)
    const productData = await aliexpressService.getProductDetails(aliExpressId);

    // 2. Grava no PostgreSQL via Prisma
    const newProduct = await prisma.product.create({
      data: {
        aliExpressId: aliExpressId.toString(), // 👈 Guardamos o ID original para referência futura
        name: productData.name,
        description: productData.description,
        price: productData.price,
        compareAtPrice: Math.ceil(productData.price * 1.5), 
        image: productData.images[0] || "https://via.placeholder.com/500", 
        gallery: productData.images,
        categoryId: categoryId || null, 
      }
    });

    // 3. Formata para o Read Model (Decimais e Datas ISO)
    const formattedProduct = { 
      ...newProduct, 
      price: newProduct.price / 100, 
      compareAtPrice: newProduct.compareAtPrice ? newProduct.compareAtPrice / 100 : null,
      createdAt: newProduct.createdAt.toISOString(),
      updatedAt: newProduct.updatedAt.toISOString()
    };

    // 4. Sincroniza instantaneamente com o DynamoDB
    await ddbDocClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: formattedProduct
    }));

    console.log(`[Importador] ✅ Produto "${formattedProduct.name}" importado com sucesso!`);

    res.status(201).json({
      message: "Produto importado com sucesso!",
      product: formattedProduct
    });

  } catch (error) {
    console.error("[ProductController] 🔴 Erro na importação:", error);
    res.status(500).json({ error: error.message || "Erro ao importar produto." });
  }
};

const invalidateCatalogCache = async () => {
  console.log('[CQRS - Command] 🧹 O Read Model será atualizado na próxima leitura.');
};

module.exports = { 
  getAllProducts, 
  getProductById, 
  invalidateCatalogCache, 
  importFromAliExpress 
};