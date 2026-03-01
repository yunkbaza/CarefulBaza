import { useState } from 'react';
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

const RESULTS_DB = {
  'Oleosa e Brilhante': {
    id: 101,
    name: 'Kit Controle & Poros Baza',
    desc: 'Gel Purificante + Sérum Niacinamida + Hidratante Aqua. Controle absoluto de oleosidade e poros dilatados sem ressecar.',
    price: 345.00,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop',
    tag: 'Rotina Matinal'
  },
  'Seca e Opaca': {
    id: 102,
    name: 'Kit Hidratação & Glow',
    desc: 'Óleo de Limpeza + Essência Noturna + Creme Rico. Nutrição intensa que devolve o viço natural e a elasticidade desde o 1º uso.',
    price: 410.00,
    image: 'https://images.unsplash.com/photo-1615397323861-125026210f84?q=80&w=600&auto=format&fit=crop',
    tag: 'Hidratação Profunda'
  },
  'Sensível e Avermelhada': {
    id: 103,
    name: 'Kit Calmante Botânico',
    desc: 'Espuma Suave + Bruma Revitalizante + Creme Calmante. Alívio imediato e proteção da barreira cutânea com ativos limpos.',
    price: 360.00,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
    tag: 'Dermatológico'
  },
  'Mista': {
    id: 104,
    name: 'Kit Equilíbrio Essencial',
    desc: 'Gel de Limpeza + Sérum Renovador + Hidratante Aqua Glow. O balanço perfeito: hidrata onde precisa, controla a zona T.',
    price: 385.00,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbce5ce?q=80&w=600&auto=format&fit=crop',
    tag: 'Mais Recomendado'
  }
};

export default function Quiz({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedKit, setRecommendedKit] = useState(null);
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(0);
    setAnswers({});
    setIsAnalyzing(false);
    setRecommendedKit(null);
    onClose();
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
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
        const skinTypeAnswer = newAnswers.skinType;
        const finalKit = RESULTS_DB[skinTypeAnswer] || RESULTS_DB['Mista'];
        setRecommendedKit(finalKit);
        setIsAnalyzing(false);
        setStep(step + 1);
      }, 2500);
    }
  };

  const handleAddToCart = () => {
    if (recommendedKit) {
      addToCart(recommendedKit);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-y-auto">
      <div className="p-6 md:p-10 flex justify-between items-center bg-white sticky top-0 z-10">
        <span className="font-syne font-bold text-xl tracking-widest uppercase text-gray-900">
          Careful Baza <span className="text-baza-lavender italic font-serif text-lg lowercase">Labs</span>
        </span>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          Fechar
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-12">
        {step < QUESTIONS.length && !isAnalyzing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header da Pergunta com botão Voltar */}
            <div className="flex justify-between items-center mb-6">
              {step > 0 ? (
                <button 
                  onClick={handleBack} 
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Voltar
                </button>
              ) : (
                <div></div> // Espaçador
              )}
              <span className="text-baza-mint font-bold uppercase tracking-widest text-[10px]">
                Passo {step + 1} de {QUESTIONS.length}
              </span>
            </div>

            <h2 className="font-syne text-3xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
              {QUESTIONS[step].question}
            </h2>
            <div className="flex flex-col gap-4">
              {QUESTIONS[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-6 border border-gray-200 hover:border-baza-lavender hover:bg-baza-lavender/5 text-gray-900 font-medium text-lg transition-all duration-300 group flex justify-between items-center shadow-sm hover:shadow-md"
                >
                  {option}
                  <svg className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-baza-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500 h-full">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-baza-lavender rounded-full animate-spin mb-8"></div>
            <h2 className="font-syne text-2xl font-bold text-gray-900 mb-4">Mapeando sua rotina...</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">Cruzando seus objetivos com nossos ativos de alta performance para o resultado perfeito.</p>
          </div>
        )}

        {step === QUESTIONS.length && !isAnalyzing && recommendedKit && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 text-center pb-12">
            <span className="text-baza-mint font-bold uppercase tracking-widest text-xs mb-4 block">
              Sua Rotina Ideal
            </span>
            <h2 className="font-syne text-4xl font-bold text-gray-900 mb-6">
              A combinação perfeita para você.
            </h2>
            <p className="text-gray-600 mb-12 max-w-md mx-auto">
              Para focar em <span className="font-bold text-gray-900">{answers.mainGoal?.toLowerCase()}</span> e tratar sua pele <span className="font-bold text-gray-900">{answers.skinType?.toLowerCase()}</span>, separamos este protocolo completo.
            </p>

            <div className="bg-gray-50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 text-left border border-gray-100 shadow-sm">
              <div className="relative w-48 h-48 flex-shrink-0">
                <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-gray-900 shadow-sm">
                  {recommendedKit.tag}
                </div>
                <img src={recommendedKit.image} alt={recommendedKit.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-syne text-2xl font-bold text-gray-900 mb-2">{recommendedKit.name}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{recommendedKit.desc}</p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-mono font-bold text-gray-900">R$ {recommendedKit.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-xs text-gray-400 bg-white px-2 py-1 border border-gray-200">Frete Grátis Integrado</span>
                </div>
                
                {/* Botões de Ação do Quiz */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gray-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-baza-lavender transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
                  >
                    Adicionar à Sacola
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  </button>
                  
                  <button 
                    onClick={handleClose}
                    className="w-full bg-white text-gray-900 border border-gray-200 py-4 text-xs font-bold uppercase tracking-widest hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
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