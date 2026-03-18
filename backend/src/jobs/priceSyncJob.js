const cron = require('node-cron');
const prisma = require('../config/prisma');
const aliexpressService = require('../services/aliexpressService');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Configuração AWS para o DynamoDB
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "CarefulBaza_Products";

/**
 * 🤖 TAREFA: Percorre todos os produtos importados e atualiza preços/stock
 */
const syncPricesWithAliExpress = async () => {
  console.log('[Cron Job] 🕒 Iniciando sincronização diária de preços...');

  try {
    // 1. Procura todos os produtos que têm ID do AliExpress
    const products = await prisma.product.findMany({
      where: { aliExpressId: { not: null } }
    });

    console.log(`[Cron Job] 🔍 Encontrados ${products.length} produtos para verificar.`);

    for (const product of products) {
      try {
        // 2. Consulta o preço atual na China
        const freshData = await aliexpressService.getProductDetails(product.aliExpressId);
        
        // 3. Verifica se o preço mudou (ou se o stock acabou)
        if (freshData.price !== product.price) {
          console.log(`[Cron Job] 💰 Mudança detetada no produto "${product.name}": ${product.price} -> ${freshData.price}`);

          // 4. Atualiza o PostgreSQL (Fonte da Verdade)
          const updatedProduct = await prisma.product.update({
            where: { id: product.id },
            data: { 
              price: freshData.price,
              compareAtPrice: Math.ceil(freshData.price * 1.5),
              updatedAt: new Date()
            }
          });

          // 5. Atualiza o DynamoDB (Read Model) para o cliente ver o preço novo na hora
          const formattedForDynamo = {
            ...updatedProduct,
            price: updatedProduct.price / 100,
            compareAtPrice: updatedProduct.compareAtPrice / 100,
            createdAt: updatedProduct.createdAt.toISOString(),
            updatedAt: updatedProduct.updatedAt.toISOString()
          };

          await ddbDocClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: formattedForDynamo
          }));
        }
      } catch (err) {
        console.error(`[Cron Job] 🔴 Erro ao sincronizar produto ${product.id}:`, err.message);
      }
    }

    console.log('[Cron Job] ✅ Sincronização concluída com sucesso.');
  } catch (error) {
    console.error('[Cron Job] ❌ Erro fatal na tarefa agendada:', error);
  }
};

// ⏰ Agendamento: Executa todos os dias às 03:00 da manhã
// Padrão: "minuto hora dia mes dia_da_semana"
cron.schedule('0 3 * * *', syncPricesWithAliExpress);

module.exports = { syncPricesWithAliExpress };