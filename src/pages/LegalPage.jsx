import { useParams, Link } from 'react-router-dom';

export default function LegalPage() {
  const { pageId } = useParams();

  // Banco de Dados das Páginas Legais e FAQ
  const CONTENT_DB = {
    'faq': {
      title: 'Dúvidas Frequentes (FAQ)',
      subtitle: 'Como podemos ajudar você hoje?',
      sections: [
        {
          heading: 'Qual é o prazo de entrega?',
          text: 'Nossos prazos variam de acordo com a sua região. Para o Sudeste, a média é de 3 a 7 dias úteis após a confirmação do pagamento. Para as demais regiões, de 5 a 12 dias úteis. Você receberá o código de rastreio por e-mail.'
        },
        {
          heading: 'Os produtos são testados em animais?',
          text: 'Nunca. A Careful Baza Labs é 100% Cruelty-Free. Nossos testes de segurança e eficácia são realizados em laboratórios utilizando peles reconstruídas in vitro e testes clínicos em humanos voluntários.'
        },
        {
          heading: 'Posso usar os séruns durante o dia?',
          text: 'Sim! Nossas fórmulas com Niacinamida, Ácido Hialurônico e Vitamina C são perfeitamente seguras para o uso diurno. Apenas a nossa "Essência Noturna" (com Retinol) deve ser restrita ao uso noturno. Lembre-se sempre de finalizar com protetor solar de manhã.'
        }
      ]
    },
    'trocas': {
      title: 'Trocas e Devoluções',
      subtitle: 'Sua satisfação é a nossa métrica principal.',
      sections: [
        {
          heading: 'Prazo de Arrependimento',
          text: 'De acordo com o Código de Defesa do Consumidor, você tem até 7 dias corridos após o recebimento do pedido para solicitar a devolução por arrependimento. O produto deve estar lacrado e sem sinais de uso.'
        },
        {
          heading: 'Como solicitar',
          text: 'Envie um e-mail para contato@carefulbaza.com.br com o número do seu pedido e o motivo da devolução. Nossa equipe enviará uma etiqueta de logística reversa para que você possa postar o produto nos Correios sem custo.'
        },
        {
          heading: 'Estorno',
          text: 'O estorno será processado assim que o produto retornar ao nosso centro logístico e passar por análise. Pagamentos via Pix são devolvidos em até 2 dias úteis. Pagamentos via Cartão de Crédito podem levar de 1 a 2 faturas para refletir.'
        }
      ]
    },
    'termos': {
      title: 'Termos de Serviço',
      subtitle: 'As regras que regem nossa plataforma.',
      sections: [
        {
          heading: 'Condições Gerais',
          text: 'Ao visitar nosso site e/ou comprar algo de nós, você se envolve em nosso "Serviço" e concorda em ficar vinculado aos seguintes termos e condições. Estes Termos de Serviço se aplicam a todos os usuários do site.'
        },
        {
          heading: 'Precisão das Informações',
          text: 'Não somos responsáveis se as informações disponibilizadas neste site não forem precisas, completas ou atuais. O material neste site é fornecido apenas para informação geral e não deve ser invocado ou usado como a única base para tomar decisões.'
        }
      ]
    },
    'privacidade': {
      title: 'Política de Privacidade',
      subtitle: 'Seus dados sob proteção de nível bancário.',
      sections: [
        {
          heading: 'Coleta de Dados',
          text: 'Quando você compra algo em nossa loja, como parte do processo de compra e venda, coletamos as informações pessoais que você nos fornece, como seu nome, endereço e e-mail. Tudo isso ocorre em um ambiente criptografado.'
        },
        {
          heading: 'Consentimento',
          text: 'Como vocês obtêm meu consentimento? Ao nos fornecer informações pessoais para completar uma transação, verificar seu cartão de crédito, fazer um pedido ou providenciar uma entrega, você concorda com a nossa coleta e uso de dados apenas para esse fim específico.'
        }
      ]
    }
  };

  const content = CONTENT_DB[pageId] || CONTENT_DB['faq'];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 pb-32 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Voltar para Home
        </Link>
        
        <h1 className="font-syne text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{content.title}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-16">{content.subtitle}</p>

        <div className="space-y-12">
          {content.sections.map((section, index) => (
            <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-8">
              <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-4">{section.heading}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                {section.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}