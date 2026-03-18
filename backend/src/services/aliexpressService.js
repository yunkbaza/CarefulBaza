const crypto = require('crypto');
const axios = require('axios');

// 🛡️ Credenciais do seu .env
const APP_KEY = process.env.ALIEXPRESS_APP_KEY;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;
const API_URL = 'https://api-sg.aliexpress.com/sync'; // Gateway oficial do AliExpress Dropshipping

/**
 * 🔐 Algoritmo Oficial de Assinatura (Taobao Open Platform)
 * O AliExpress exige que todos os parâmetros sejam ordenados alfabeticamente,
 * concatenados com o Secret e transformados em um hash MD5.
 */
const generateSign = (params) => {
    const sortedKeys = Object.keys(params).sort();
    let signString = APP_SECRET;
    
    for (const key of sortedKeys) {
        // Ignora campos que não devem ser assinados
        if (key !== 'sign' && key !== 'sign_method') {
            signString += key + params[key];
        }
    }
    
    signString += APP_SECRET;
    return crypto.createHash('md5').update(signString, 'utf8').digest('hex').toUpperCase();
};

/**
 * 📥 Função 1: Buscar Detalhes do Produto (Ou usar MOCK se não tiver chave)
 */
const getProductDetails = async (productId) => {
    // 🚦 MOCK (Simulação) enquanto a sua conta aguarda aprovação
    if (!APP_KEY || APP_KEY === 'coloque_sua_app_key_aqui') {
        console.log(`[AliExpress - MOCK] Simulando importação do produto ${productId}...`);
        return {
            aliExpressId: productId,
            name: "Sérum Facial Ácido Hialurônico (Importado)",
            price: 8990, // R$ 89,90 em centavos
            description: "Sérum de alta hidratação simulado pela API de teste.",
            images: [
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
                "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80"
            ]
        };
    }

    try {
        console.log(`[AliExpress] 📡 Buscando dados reais do produto ${productId}...`);
        
        // Montamos os parâmetros obrigatórios da API
        const params = {
            method: 'aliexpress.postproduct.redefining.findaeproductbyidfordropshipper',
            app_key: APP_KEY,
            timestamp: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), // Formato exigido: yyyy-MM-dd HH:mm:ss ou ISO
            format: 'json',
            v: '2.0',
            sign_method: 'md5',
            product_id: productId
        };

        // Adiciona a assinatura criptografada
        params.sign = generateSign(params);

        // Dispara o pedido para a China
        const response = await axios.post(API_URL, new URLSearchParams(params).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const result = response.data.aliexpress_postproduct_redefining_findaeproductbyidfordropshipper_response;

        if (!result || !result.result) {
            throw new Error("Produto não encontrado ou API retornou erro de permissão.");
        }

        const productInfo = result.result;
        
        // 🧹 Limpamos o JSON para o formato do nosso PostgreSQL
        return {
            aliExpressId: productId.toString(),
            name: productInfo.subject,
            price: Math.ceil(productInfo.target_sale_price * 100), 
            description: productInfo.detail,
            images: productInfo.image_urls ? productInfo.image_urls.split(';') : [] 
        };

    } catch (error) {
        console.error("[AliExpress] 🔴 Erro ao buscar produto:", error.response ? error.response.data : error.message);
        throw new Error("Falha na comunicação com a API do AliExpress.");
    }
};

module.exports = { getProductDetails };