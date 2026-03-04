import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// MAPEAMENTO EXATO: Idioma -> Moeda Oficial
export const CURRENCY_MAP = {
  pt: 'BRL', // Português -> Real Brasileiro
  en: 'USD', // Inglês -> Dólar Americano
  es: 'EUR', // Espanhol -> Euro
  fr: 'EUR', // Francês -> Euro
  de: 'EUR', // Alemão -> Euro
  ru: 'RUB', // Russo -> Rublo Russo
  zh: 'CNY'  // Mandarim -> Yuan Chinês
};

export function useCurrency() {
  const { i18n } = useTranslation();
  const [rates, setRates] = useState(null);
  
  // Pega o idioma atual (ex: 'en') e descobre a moeda (ex: 'USD')
  const currentLng = i18n.language ? i18n.language.split('-')[0] : 'pt';
  const targetCurrency = CURRENCY_MAP[currentLng] || 'BRL';

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Mudei o nome do cache para forçar a atualização automática agora
        const CACHE_KEY = 'baza_rates_v2';
        const cached = localStorage.getItem(CACHE_KEY);
        
        if (cached) {
          const { rates, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
            setRates(rates);
            return;
          }
        }

        // ⚠️ ATENÇÃO: COLE A SUA CHAVE REAL AQUI EMBAIXO
        const API_KEY = 'd51b930e69819f682946a899'; 
        
        if (API_KEY === 'd51b930e69819f682946a899') {
          console.warn("⚠️ AVISO: Você esqueceu de colocar a API Key real no useCurrency.js. O preço vai ficar travado em Reais.");
        }

        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/BRL`);
        const data = await response.json();

        if (data.result === 'success') {
          console.log("✅ Taxas de câmbio atualizadas com sucesso!");
          setRates(data.conversion_rates);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            rates: data.conversion_rates,
            timestamp: Date.now()
          }));
        } else {
          console.error("❌ Erro na API de Câmbio:", data['error-type']);
        }
      } catch (error) {
        console.error("❌ Falha na conexão com a API de Câmbio:", error);
      }
    };

    fetchRates();
  }, []);

  const convertAndFormat = useCallback((valueInBRL) => {
    // Se ainda não carregou as taxas, ou deu erro, devolve em Reais formatado
    if (!rates || !rates[targetCurrency]) {
      return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: 'BRL',
      }).format(valueInBRL);
    }

    // Calcula: Valor em Reais * Taxa da Moeda Destino
    const convertedValue = valueInBRL * rates[targetCurrency];

    // Formata perfeitamente (ex: $ 39.90, 39,90 €, etc.)
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: targetCurrency,
    }).format(convertedValue);
  }, [rates, targetCurrency, i18n.language]);

  return { convertAndFormat, currentCurrency: targetCurrency };
}