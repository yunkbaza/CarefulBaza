const crypto = require('crypto');
const axios = require('axios');

// 🛡️ Credenciais do ambiente
const APP_KEY = process.env.ALIEXPRESS_APP_KEY;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;
const API_URL = 'https://api-sg.aliexpress.com/sync'; 

/**
 * 🔐 Algoritmo Oficial de Assinatura (Taobao Open Platform)
 * Necessário para que a API da China aceite o nosso pedido.
 */
const generateSign = (params) => {
    const sortedKeys = Object.keys(params).sort();
    let signString = APP_SECRET;
    
    for (const key of sortedKeys) {
        if (key !== 'sign' && key !== 'sign_method' && params[key] !== undefined) {
            signString += key + params[key];
        }
    }
    
    signString += APP_SECRET;
    return crypto.createHash('md5').update(signString, 'utf8').digest('hex').toUpperCase();
};

/**
 * 📥 Buscar Detalhes do Produto (AliExpress Dropshipping API)
 */
const getProductDetails = async (productId) => {
    // 🚦 MOCK: Ativa-se se as chaves não estiverem configuradas no .env
    if (!APP_KEY || APP_KEY === 'sua_chave_aqui') {
        console.log(`[AliExpress - MOCK] A simular dados para o produto: ${productId}`);
        return {
            name: "Sérum Facial Careful Baza (Importado)",
            price: 8990, // R$ 89,90 em centavos
            description: "Fórmula avançada de hidratação importada com tecnologia de ponta.",
            images: [
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
                "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800"
            ]
        };
    }

    try {
        // 📅 Formatação de Timestamp (YYYY-MM-DD HH:mm:ss) exigida pela API
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').split('.')[0];

        const params = {
            method: 'aliexpress.postproduct.redefining.findaeproductbyidfordropshipper',
            app_key: APP_KEY,
            timestamp: timestamp,
            format: 'json',
            v: '2.0',
            sign_method: 'md5',
            product_id: productId
        };

        params.sign = generateSign(params);

        const response = await axios.post(API_URL, new URLSearchParams(params).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const result = response.data.aliexpress_postproduct_redefining_findaeproductbyidfordropshipper_response;

        if (!result || !result.result || !result.result.success) {
            throw new Error("Produto não encontrado ou API do AliExpress recusou o acesso.");
        }

        const productInfo = result.result;
        
        // 🧹 Limpeza e Formatação para o nosso schema do Prisma
        return {
            name: productInfo.subject,
            // Converte preço (ex: 15.50) para centavos (1550)
            price: Math.ceil(parseFloat(productInfo.target_sale_price) * 100), 
            description: productInfo.detail || "Sem descrição disponível do fornecedor.",
            // Limpa URLs de imagens
            images: productInfo.image_urls 
                ? productInfo.image_urls.split(';').map(url => url.trim()) 
                : []
        };

    } catch (error) {
        console.error("[AliExpress Service] 🔴 Erro:", error.message);
        throw new Error("Não foi possível conectar com o fornecedor AliExpress.");
    }
};

module.exports = { getProductDetails };