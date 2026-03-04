const API_KEY = 'SUA_CHAVE_AQUI'; // Pegue uma grátis em exchangerate-api.com
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

export const fetchExchangeRates = async () => {
  try {
    // Tenta carregar do cache para poupar a franquia da API
    const cached = localStorage.getItem('exchange_rates');
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      // Se tiver menos de 12 horas, usa o cache
      if (Date.now() - timestamp < 12 * 60 * 60 * 1000) return rates;
    }

    const response = await fetch(BASE_URL);
    const data = await response.json();

    if (data.result === 'success') {
      localStorage.setItem('exchange_rates', JSON.stringify({
        rates: data.conversion_rates,
        timestamp: Date.now()
      }));
      return data.conversion_rates;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar câmbio:", error);
    return null;
  }
};