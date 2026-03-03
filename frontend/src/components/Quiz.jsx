import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const QUESTIONS = [
  {
    id: 'skinType',
    question: 'Como você descreve a sua pele hoje?',
    options: ['Seca e Opaca', 'Oleosa e Brilhante', 'Mista', 'Sensível e Avermelhada']
  },
  {
    id: 'mainGoal',
    question: 'Qual é o seu principal objetivo de cuidado?',
    options: ['Prevenção de Sinais', 'Controle de Acne e Poros', 'Uniformizar o Tom', 'Hidratação Profunda']
  },
  {
    id: 'routineTime',
    question: 'Quanto tempo você dedica à sua rotina diária?',
    options: ['Sou prática (Até 3 min)', 'Gosto de um ritual (5 a 10 min)', 'Procuro tratamentos noturnos']
  },
  {
    id: 'sunReaction',
    question: 'Como sua pele reage à exposição solar?',
    options: ['Fica vermelha e queima', 'Bronzeia facilmente', 'Gera manchas (Melasma)', 'Não costumo me expor']
  },
  {
    id: 'texturePref',
    question: 'Qual textura de produto mais te agrada?',
    options: ['Gel aquoso e refrescante', 'Creme rico e denso', 'Óleos nutritivos', 'Indiferente, quero resultados']
  }
];

// O NOVO CÉREBRO DO QUIZ: Ele procura o produto pelo NOME exato que está no banco de dados
const DYNAMIC_MAPPING = {
  'Oleosa e Brilhante': {
    targetName: 'Espuma de Limpeza Purificante',
    desc: 'Limpeza profunda que controla o brilho ao longo do dia sem causar o efeito repuxado.',
    tag: 'Rotina Matinal'
  },
  'Seca e Opaca': {
    targetName: 'Hidratante Aqua Glow',
    desc: 'Nutrição intensa que devolve o viço natural e a elasticidade desde o 1º uso.',
    tag: 'Hidratação Profunda'
  },
  'Sensível e Avermelhada': {
    targetName: 'Bruma Calmante Revitalizante',
    desc: 'Alívio imediato e proteção da barreira cutânea com ativos botânicos e limpos.',
    tag: 'Dermatológico'
  },
  'Mista': {
    targetName: 'Kit Rotina Completa 5 Passos',
    desc: 'O balanço perfeito: trata todas as áreas do seu rosto com a nossa linha completa de alta performance.',
    tag: 'Mais Recomendado'
  }
};

export default function Quiz({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedKit, setRecommendedKit] = useState(null);
  
  // Novo estado para guardar os produtos reais vindos da API
  const [dbProducts, setDbProducts] = useState([]);
  const { addToCart } = useCart();

  // Quando o quiz abre, ele vai buscar a lista de produtos reais ao Back-end
  useEffect(() => {
    if (isOpen) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      fetch(`${apiUrl}/products`)
        .then(res => res.json())
        .then(data => setDbProducts(data))
        .catch(err => console.error("Erro ao carregar produtos para o quiz", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(0);
    setAnswers({});
    setIsAnalyzing(false);
    setRecommendedKit(null);
    onClose();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAnswer = (answer) => {
    const currentQuestion = QUESTIONS[step].id;
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        // LÓGICA DE MATCH: Encontra o produto real no banco de dados baseado na resposta
        const skinTypeAnswer = newAnswers.skinType;
        const mapping = DYNAMIC_MAPPING[skinTypeAnswer] || DYNAMIC_MAPPING['Mista'];
        
        // Procura no banco o produto com o mesmo nome
        const realProduct = dbProducts.find(p => p.name === mapping.targetName) || dbProducts[0]; 
        
        if (realProduct) {
          // Junta os dados reais do banco (ID, Preço, Imagem) com os textos persuasivos do Quiz
          setRecommendedKit({
            ...realProduct, 
            desc: mapping.desc,
            tag: mapping.tag
          });
        }
        
        setIsAnalyzing(false);
        setStep(step + 1);
      }, 2500);
    }
  };

  const handleAddToCart = () => {
    if (recommendedKit) {
      addToCart(recommendedKit); // Agora ele envia o produto com o ID real para o carrinho!
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col overflow-y-auto transition-colors duration-300">
      
      {/* HEADER DO QUIZ */}
      <div className="p-6 md:p-10 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors duration-300">
        <span className="font-syne font-bold text-xl tracking-widest uppercase text-gray-900 dark:text-white transition-colors">
          Careful Baza <span className="text-baza-lavender dark:text-baza-mint italic font-serif text-lg lowercase">Labs</span>
        </span>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          Fechar
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-12">
        
        {/* PASSO A PASSO (PERGUNTAS) */}
        {step < QUESTIONS.length && !isAnalyzing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="flex justify-between items-center mb-6">
              {step > 0 ? (
                <button 
                  onClick={handleBack} 
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Voltar
                </button>
              ) : (
                <div></div>
              )}
              <span className="text-baza-mint font-bold uppercase tracking-widest text-[10px]">
                Passo {step + 1} de {QUESTIONS.length}
              </span>
            </div>

            <h2 className="font-syne text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-12 leading-tight transition-colors">
              {QUESTIONS[step].question}
            </h2>
            <div className="flex flex-col gap-4">
              {QUESTIONS[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-6 border border-gray-200 dark:border-gray-700 hover:border-baza-lavender dark:hover:border-baza-mint hover:bg-baza-lavender/5 dark:hover:bg-baza-lavender/10 text-gray-900 dark:text-white font-medium text-lg transition-all duration-300 group flex justify-between items-center shadow-sm hover:shadow-md"
                >
                  {option}
                  <svg className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-baza-lavender dark:text-baza-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TELA DE ANÁLISE (CARREGANDO) */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500 h-full">
            <div className="w-16 h-16 border-4 border-gray-100 dark:border-gray-800 border-t-baza-lavender dark:border-t-baza-mint rounded-full animate-spin mb-8 transition-colors"></div>
            <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Mapeando sua rotina...</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto transition-colors">Cruzando seus objetivos com nossos ativos de alta performance para o resultado perfeito.</p>
          </div>
        )}

        {/* TELA DE RESULTADO */}
        {step === QUESTIONS.length && !isAnalyzing && recommendedKit && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 text-center pb-12">
            <span className="text-baza-mint font-bold uppercase tracking-widest text-xs mb-4 block">
              Sua Rotina Ideal
            </span>
            <h2 className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              A combinação perfeita para você.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto transition-colors">
              Para focar em <span className="font-bold text-gray-900 dark:text-white transition-colors">{answers.mainGoal?.toLowerCase()}</span> e tratar sua pele <span className="font-bold text-gray-900 dark:text-white transition-colors">{answers.skinType?.toLowerCase()}</span>, separamos este protocolo completo.
            </p>

            {/* CARD DO KIT RECOMENDADO */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 text-left border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300">
              <div className="relative w-48 h-48 flex-shrink-0 bg-white dark:bg-gray-900 rounded-sm overflow-hidden border border-gray-100 dark:border-gray-800 p-2 transition-colors">
                <div className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-gray-900 dark:text-white shadow-sm transition-colors">
                  {recommendedKit.tag}
                </div>
                <img src={recommendedKit.image} alt={recommendedKit.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">{recommendedKit.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed transition-colors">{recommendedKit.desc}</p>
                <div className="flex items-center gap-4 mb-6">
                  {recommendedKit.compareAtPrice && (
                    <span className="text-sm font-mono line-through text-gray-400 dark:text-gray-500">
                      R$ {recommendedKit.compareAtPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white transition-colors">
                    R$ {recommendedKit.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 px-2 py-1 border border-gray-200 dark:border-gray-700 transition-colors">Frete Grátis Integrado</span>
                </div>
                
                {/* BOTÕES DO QUIZ */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-xs font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
                  >
                    Adicionar à Sacola
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  </button>
                  
                  <button 
                    onClick={handleClose}
                    className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 py-4 text-xs font-bold uppercase tracking-widest hover:border-gray-900 dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
                  >
                    Agora não, obrigado
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}