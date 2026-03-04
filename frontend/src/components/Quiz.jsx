import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

export default function Quiz({ isOpen, onClose }) {
  const { t } = useTranslation(); // Removido o 'i18n' para eliminar o erro do ESLint
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedKit, setRecommendedKit] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const { addToCart } = useCart();

  // As perguntas agora puxam as traduções do seu dicionário JSON
  const QUESTIONS = [
    {
      id: 'skinType',
      question: t('quiz.q_skin_type'),
      options: [t('quiz.opt_dry'), t('quiz.opt_oily'), t('quiz.opt_mixed'), t('quiz.opt_sensitive')]
    },
    {
      id: 'mainGoal',
      question: t('quiz.q_goal'),
      options: [t('quiz.opt_aging'), t('quiz.opt_acne'), t('quiz.opt_tone'), t('quiz.opt_hydration')]
    },
    {
      id: 'routineTime',
      question: t('quiz.q_time'),
      options: [t('quiz.opt_fast'), t('quiz.opt_ritual'), t('quiz.opt_night')]
    },
    {
      id: 'sunReaction',
      question: t('quiz.q_sun'),
      options: [t('quiz.opt_burns'), t('quiz.opt_tans'), t('quiz.opt_spots'), t('quiz.opt_none')]
    },
    {
      id: 'texturePref',
      question: t('quiz.q_texture'),
      options: [t('quiz.opt_gel'), t('quiz.opt_cream'), t('quiz.opt_oil'), t('quiz.opt_any')]
    }
  ];

  // Mapeamento dinâmico baseado nas chaves de tradução
  const DYNAMIC_MAPPING = {
    [t('quiz.opt_oily')]: {
      targetName: 'Espuma de Limpeza Purificante',
      desc: t('quiz.res_oily_desc'),
      tag: t('quiz.tag_morning')
    },
    [t('quiz.opt_dry')]: {
      targetName: 'Hidratante Aqua Glow',
      desc: t('quiz.res_dry_desc'),
      tag: t('quiz.tag_deep')
    },
    [t('quiz.opt_sensitive')]: {
      targetName: 'Bruma Calmante Revitalizante',
      desc: t('quiz.res_sens_desc'),
      tag: t('product_ui.tested')
    },
    [t('quiz.opt_mixed')]: {
      targetName: 'Kit Rotina Completa 5 Passos',
      desc: t('quiz.res_mixed_desc'),
      tag: t('quiz.tag_rec')
    }
  };

  useEffect(() => {
    if (isOpen) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      fetch(`${apiUrl}/products`)
        .then(res => res.json())
        .then(data => setDbProducts(data))
        .catch(err => console.error(err));
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
        const mapping = DYNAMIC_MAPPING[skinTypeAnswer] || DYNAMIC_MAPPING[t('quiz.opt_mixed')];
        
        const realProduct = dbProducts.find(p => p.name === mapping.targetName) || dbProducts[0]; 
        
        if (realProduct) {
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

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col overflow-y-auto transition-colors">
      <div className="p-6 md:p-10 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
        <span className="font-syne font-bold text-xl tracking-widest uppercase text-gray-900 dark:text-white">
          Careful Baza <span className="text-baza-lavender dark:text-baza-mint italic font-serif text-lg lowercase">Labs</span>
        </span>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          {t('quiz.close')}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-12">
        {step < QUESTIONS.length && !isAnalyzing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-6">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  {t('quiz.back')}
                </button>
              )}
              <span className="text-baza-mint font-bold uppercase tracking-widest text-[10px]">
                {t('quiz.step', { current: step + 1, total: QUESTIONS.length })}
              </span>
            </div>

            <h2 className="font-syne text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-12 leading-tight">
              {QUESTIONS[step].question}
            </h2>
            <div className="flex flex-col gap-4">
              {QUESTIONS[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-6 border border-gray-200 dark:border-gray-700 hover:border-baza-lavender dark:hover:border-baza-mint text-gray-900 dark:text-white font-medium text-lg transition-all flex justify-between items-center"
                >
                  {option}
                  <svg className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 border-4 border-t-baza-lavender rounded-full animate-spin mb-8"></div>
            <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('quiz.analyzing')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">{t('quiz.analyzing_desc')}</p>
          </div>
        )}

        {step === QUESTIONS.length && !isAnalyzing && recommendedKit && (
          <div className="animate-in fade-in duration-1000 text-center pb-12">
            <span className="text-baza-mint font-bold uppercase tracking-widest text-xs mb-4 block">
              {t('quiz.result_tag')}
            </span>
            <h2 className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('quiz.result_title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto">
              {t('quiz.result_desc', { goal: answers.mainGoal?.toLowerCase(), skin: answers.skinType?.toLowerCase() })}
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 text-left border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="relative w-48 h-48 flex-shrink-0 bg-white dark:bg-gray-900 rounded-sm overflow-hidden p-2">
                <div className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-gray-900 dark:text-white shadow-sm">
                  {recommendedKit.tag}
                </div>
                <img src={recommendedKit.image} alt={recommendedKit.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-2">{recommendedKit.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">{recommendedKit.desc}</p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                    ${recommendedKit.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 px-2 py-1 border border-gray-200 dark:border-gray-700">{t('quiz.free_shipping')}</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { addToCart(recommendedKit); handleClose(); }}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-xs font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    {t('quiz.add_btn')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  </button>
                  <button onClick={handleClose} className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 py-4 text-xs font-bold uppercase tracking-widest hover:border-gray-900 dark:hover:border-white transition-all flex items-center justify-center">
                    {t('quiz.decline_btn')}
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