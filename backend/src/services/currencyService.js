const axios = require('axios');

async function getExchangeRate(targetCurrency) {
  if (targetCurrency.toLowerCase() === 'brl') return 1;
  const apiKey = process.env.EXCHANGE_API_KEY;
  if (!apiKey) return 1; 

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/BRL`);
    if (response.data.result === 'success') {
      return response.data.conversion_rates[targetCurrency.toUpperCase()] || 1;
    } 
  } catch (error) {
    console.error("🔴 FALHA DE CONEXÃO COM A API DE CÂMBIO:", error.message);
  }
  return 1;
}

module.exports = { getExchangeRate };