import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';

export default function SciencePage() {
  const { topicId } = useParams();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  
  // CORREÇÃO: Usar 'convertAndFormat' que é o nome real da sua função no hook!
  const { convertAndFormat } = useCurrency(); 

  // O "Cérebro" Editorial 100% Completo e Traduzido
  const CONTENT_DB = {
    'tipos-de-pele': {
      title: t('science.skin.title', 'Guia Definitivo: Tipos de Pele'),
      subtitle: t('science.skin.subtitle', 'Entenda a biologia do seu rosto para uma rotina de alta performance.'),
      intro: t('science.skin.intro', 'Identificar seu tipo de pele é o primeiro passo para parar de gastar dinheiro com produtos errados. A pele é um órgão vivo e dinâmico, e suas necessidades mudam. Abaixo, mapeamos os perfis mais comuns e a ciência exata para tratá-los.'),
      sections: [
        {
          id: 'oleosa',
          title: t('science.skin.oily.title', 'Pele Oleosa e com Poros Dilatados'),
          body: t('science.skin.oily.body', 'Caracterizada pela superprodução de sebo pelas glândulas sebáceas. O brilho excessivo aparece poucas horas após a lavagem e os poros ficam visíveis. O erro mais comum é lavar o rosto várias vezes ao dia com sabonetes fortes, o que remove a proteção natural e causa o "efeito rebote" (a pele entra em pânico e produz o dobro de óleo).'),
          clinicalTip: t('science.skin.oily.tip', 'Evite esfoliantes de bolinhas grossas. Eles geram microlesões que inflamam os poros. Prefira uma esfoliação química suave e hidratação ultraleve em gel.'),
          suggestedProduct: {
            id: '1',
            name: t('science.skin.oily.prod_name', 'Sérum Renovador'),
            category: t('science.skin.oily.prod_cat', 'Controle de Oleosidade'),
            price: 189.90,
            image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbce5ce?q=80&w=600&auto=format&fit=crop',
            tag: t('science.skin.oily.prod_tag', 'Mais Vendido'),
            whyItWorks: t('science.skin.oily.why', 'A Niacinamida penetra nos poros e "avisa" a glândula para diminuir a produção de óleo, enquanto o Zinco age secando as espinhas ativas.')
          }
        },
        {
          id: 'seca',
          title: t('science.skin.dry.title', 'Pele Seca e Barreira Comprometida'),
          body: t('science.skin.dry.body', 'Ao contrário da pele desidratada (que apenas precisa de água), a pele seca não produz lipídios (óleos naturais) suficientes. Sem esse "cimento" natural, a água que você bebe evapora pela pele facilmente. Ela repuxa, tem textura áspera e descama.'),
          clinicalTip: t('science.skin.dry.tip', 'Nunca lave o rosto com água quente do chuveiro. A alta temperatura derrete os poucos óleos naturais que sua pele conseguiu produzir para se defender.'),
          suggestedProduct: {
            id: '2',
            name: t('science.skin.dry.prod_name', 'Hidratante Aqua Glow'),
            category: t('science.skin.dry.prod_cat', 'Reposição Lipídica'),
            price: 145.00,
            image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop',
            tag: t('science.skin.dry.prod_tag', 'Para Viço'),
            whyItWorks: t('science.skin.dry.why', 'Combina Ácido Hialurônico (para puxar água) e Ceramidas (para trancar essa água lá dentro), restaurando o conforto no primeiro uso.')
          }
        },
        {
          id: 'sensivel',
          title: t('science.skin.sensitive.title', 'Pele Sensível e Avermelhada'),
          body: t('science.skin.sensitive.body', 'A pele sensível é uma condição de inflamação. A barreira de proteção está tão fina que vento, cosméticos e até o estresse penetram fácil, ativando alertas que geram vermelhidão e ardência. O foco aqui não é renovar, é acalmar.'),
          clinicalTip: t('science.skin.sensitive.tip', 'Adote o minimalismo (Skin Diet). Quando a pele estiver em crise ardendo, suspenda ácidos e use apenas sabonete suave e um hidratante calmante.'),
          suggestedProduct: {
            id: '5',
            name: t('science.skin.sensitive.prod_name', 'Bruma Revitalizante'),
            category: t('science.skin.sensitive.prod_cat', 'S.O.S Barreira Cutânea'),
            price: 110.00,
            image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
            tag: t('science.skin.sensitive.prod_tag', 'Dermatológico'),
            whyItWorks: t('science.skin.sensitive.why', 'Seus prebióticos botânicos alimentam as "bactérias boas" da pele, criando uma camada protetora que reduz a vermelhidão na mesma hora.')
          }
        }
      ]
    },
    'ativos': {
      title: t('science.ingredients.title', 'Dicionário Clínico de Ativos'),
      subtitle: t('science.ingredients.subtitle', 'Transparência total sobre o que realmente transforma sua pele.'),
      intro: t('science.ingredients.intro', 'A indústria cosmética lucra com promessas vazias e nomes complicados. Na Careful Baza Labs, nós traduzimos a ciência para você saber exatamente no que está investindo.'),
      sections: [
        {
          id: 'niacinamida',
          title: t('science.ingredients.niacinamide.title', 'Niacinamida (Vitamina B3)'),
          body: t('science.ingredients.niacinamide.body', 'É como o "faz-tudo" do skincare. Ela clareia manchas (bloqueando o pigmento de subir para a superfície), diminui o tamanho visual dos poros e acalma espinhas inflamadas. O melhor de tudo? Não irrita e pode ser usada sob o sol.'),
          clinicalTip: t('science.ingredients.niacinamide.tip', 'Séruns de Niacinamida combinam com tudo. Você pode misturar com Vitamina C de manhã ou Retinol à noite sem medo de dar reação.'),
          suggestedProduct: {
            id: '1',
            name: t('science.ingredients.niacinamide.prod_name', 'Sérum Renovador'),
            category: t('science.ingredients.niacinamide.prod_cat', 'Niacinamida 10%'),
            price: 189.90,
            image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbce5ce?q=80&w=600&auto=format&fit=crop',
            tag: t('science.ingredients.niacinamide.prod_tag', 'Alta Concentração'),
            whyItWorks: t('science.ingredients.niacinamide.why', 'Uma dose clínica de 10% garante resultados visíveis em 14 dias para poros e textura irregular, com zero ardência.')
          }
        },
        {
          id: 'retinol',
          title: t('science.ingredients.retinol.title', 'Retinol (Vitamina A)'),
          body: t('science.ingredients.retinol.body', 'O único ativo provado por cientistas que realmente reverte o envelhecimento. Ele entra na célula e manda ela "trabalhar mais rápido", trocando a pele velha por uma nova. Afina a parte de cima (dando brilho) e engrossa a de baixo (estimulando colágeno).'),
          clinicalTip: t('science.ingredients.retinol.tip', 'Se você é iniciante no Retinol, use a técnica do "Sanduíche": Aplique hidratante, depois o Retinol, e depois hidratante por cima de novo. Isso evita descamação.'),
          suggestedProduct: {
            id: '4',
            name: t('science.ingredients.retinol.prod_name', 'Essência Noturna'),
            category: t('science.ingredients.retinol.prod_cat', 'Renovação Celular'),
            price: 250.00,
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
            tag: t('science.ingredients.retinol.prod_tag', 'Uso Noturno'),
            whyItWorks: t('science.ingredients.retinol.why', 'Envelopamos o ativo em nanocápsulas. Ele entra na pele e só se abre lá no fundo, garantindo colágeno novo sem deixar o rosto vermelho.')
          }
        }
      ]
    },
    'tipos-de-cabelo': {
      title: t('science.hair.title', 'A Ciência da Tricologia'),
      subtitle: t('science.hair.subtitle', 'Diagnosticando a saúde estrutural dos seus fios.'),
      intro: t('science.hair.intro', 'Saber se o seu cabelo é liso ou crespo é apenas estética. Para tratar de verdade, precisamos olhar no microscópio e entender a porosidade (o nível de dano da "capa" que protege o fio).'),
      sections: [
        {
          id: 'poroso',
          title: t('science.hair.porous.title', 'Cabelo Poroso e Danificado (Com Frizz)'),
          body: t('science.hair.porous.body', 'Imagine o fio de cabelo como um telhado. Num cabelo saudável, as telhas (cutículas) estão bem fechadas. No cabelo poroso (por causa de chapinha, descoloração ou sol), as telhas estão levantadas. A água do chuveiro entra fácil, mas evapora em segundos, deixando o fio seco e armado.'),
          clinicalTip: t('science.hair.porous.tip', 'Faça o teste do copo: coloque um fio de cabelo solto num copo d\'água. Se afundar rápido, é poroso (precisa de óleo e reconstrução). Se ficar boiando no topo, é pouco poroso (só precisa de hidratação leve).'),
          suggestedProduct: {
            id: '3',
            name: t('science.hair.porous.prod_name', 'Óleo Reparador Botânico'),
            category: t('science.hair.porous.prod_cat', 'Selagem de Cutículas'),
            price: 210.00,
            image: 'https://images.unsplash.com/photo-1615397323861-125026210f84?q=80&w=600&auto=format&fit=crop',
            tag: t('science.hair.porous.prod_tag', 'Tratamento'),
            whyItWorks: t('science.hair.porous.why', 'Os óleos vegetais densos agem como uma "cola" para as telhas do cabelo, selando as cutículas e impedindo a umidade de escapar ao longo do dia.')
          }
        },
        {
          id: 'fino',
          title: t('science.hair.fine.title', 'Fios Finos, Oleosos e Sem Volume'),
          body: t('science.hair.fine.body', 'O cabelo fino é muito delicado e tem menos "corpo". Como o fio é muito liso e leve, a oleosidade natural que o couro cabeludo produz escorrega até as pontas muito rápido, deixando o cabelo com aspecto "murcho" no mesmo dia que lavou.'),
          clinicalTip: t('science.hair.fine.tip', 'A regra de ouro para cabelos finos: O condicionador nunca deve tocar do meio para cima da cabeça. Aplique apenas nas pontinhas extremas para não pesar a raiz.'),
          suggestedProduct: {
            id: '6',
            name: t('science.hair.fine.prod_name', 'Bruma Revitalizante (Uso Capilar)'),
            category: t('science.hair.fine.prod_cat', 'Detox Capilar'),
            price: 110.00,
            image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
            tag: t('science.hair.fine.prod_tag', 'Volume Natural'),
            whyItWorks: t('science.hair.fine.why', 'Sendo 100% livre de silicones pesados, desembaraça o cabelo fino trazendo maciez, sem adicionar o peso de cremes tradicionais.')
          }
        }
      ]
    },
    'dicas': {
      title: t('science.tips.title', 'Protocolos de Rotina'),
      subtitle: t('science.tips.subtitle', 'A engenharia por trás de um skincare impecável.'),
      intro: t('science.tips.intro', 'Comprar produtos caros e aplicar na ordem errada joga dinheiro no lixo. A regra universal da cosmetologia é simples: aplique sempre do produto mais líquido para o mais grosso.'),
      sections: [
        {
          id: 'matinal',
          title: t('science.tips.morning.title', 'A Rotina da Manhã (Ataque & Defesa)'),
          body: t('science.tips.morning.body', 'O objetivo da manhã não é tratar problemas graves, é proteger seu rosto do sol, da fumaça dos carros e da luz do celular. O protocolo correto é: 1. Limpeza Suave > 2. Antioxidante (ex: Vitamina C) > 3. Hidratante Leve > 4. Protetor Solar.'),
          clinicalTip: t('science.tips.morning.tip', 'Se a sua pele for normal a seca, você não precisa usar sabonete de manhã! Apenas lave o rosto com água fria. Isso salva a hidratação que sua pele construiu enquanto você dormia.'),
          suggestedProduct: {
            id: '1',
            name: t('science.tips.morning.prod_name', 'Sérum Renovador'),
            category: t('science.tips.morning.prod_cat', 'Defesa Antioxidante'),
            price: 189.90,
            image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbce5ce?q=80&w=600&auto=format&fit=crop',
            tag: t('science.tips.morning.prod_tag', 'Uso Diurno'),
            whyItWorks: t('science.tips.morning.why', 'A Niacinamida age como um escudo que protege as células contra o escurecimento de manchas causado pela radiação e poluição diária.')
          }
        },
        {
          id: 'noturna',
          title: t('science.tips.night.title', 'A Rotina Noturna (Conserto & Reparação)'),
          body: t('science.tips.night.body', 'Durante o sono profundo, o seu fluxo de sangue no rosto aumenta e a pele entra em "modo reforma". Essa é a hora de colocar os ativos fortes (como os ácidos) para trabalhar. A ordem é: 1. Limpeza Profunda > 2. Tratamento Específico (Séruns) > 3. Creme Hidratante Rico.'),
          clinicalTip: t('science.tips.night.tip', 'O segredo coreano da Limpeza Dupla (Double Cleansing): Use um produto à base de óleo primeiro para derreter a maquiagem e o protetor solar, e depois lave com seu sabonete facial em gel para limpar os poros de verdade.'),
          suggestedProduct: {
            id: '2',
            name: t('science.tips.night.prod_name', 'Hidratante Aqua Glow'),
            category: t('science.tips.night.prod_cat', 'Selamento Noturno'),
            price: 145.00,
            image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop',
            tag: t('science.tips.night.prod_tag', 'Creme Noturno'),
            whyItWorks: t('science.tips.night.why', 'Usado como último passo da noite, ele cria um "cobertor" invisível sobre a pele, impedindo que a água e os séruns evaporem enquanto você dorme.')
          }
        }
      ]
    }
  };

  const content = CONTENT_DB[topicId] || {
    title: t('science.fallback.title', 'Editorial Care'),
    subtitle: t('science.fallback.subtitle', 'Nossos cadernos científicos estão em atualização.'),
    intro: t('science.fallback.intro', 'Selecione uma categoria no menu "A Ciência" para acessar nossos artigos mais recentes.'),
    sections: []
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 pb-32 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {t('science.ui.back_home', 'Voltar para Home')}
        </Link>
        <span className="text-baza-mint font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Careful Baza Labs</span>
        <h1 className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{content.title}</h1>
        <h2 className="text-xl md:text-2xl text-baza-lavender dark:text-baza-mint font-serif italic mb-10">{content.subtitle}</h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-16 max-w-2xl">{content.intro}</p>

        <div className="flex flex-col gap-24">
          {content.sections.map((section) => (
            <div key={section.id} className="scroll-mt-32 border-t border-gray-100 dark:border-gray-800 pt-12" id={section.id}>
              
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Coluna de Texto */}
                <div className="lg:w-7/12">
                  <h3 className="font-syne text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">{section.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-lg">{section.body}</p>
                  
                  {/* Dica Clínica de Autoridade */}
                  {section.clinicalTip && (
                    <div className="bg-baza-lavender/5 dark:bg-baza-lavender/10 border-l-2 border-baza-lavender p-6 mb-8 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-baza-lavender"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-baza-lavender dark:text-baza-mint">
                          {t('science.ui.golden_tip', 'A Dica de Ouro')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{section.clinicalTip}</p>
                    </div>
                  )}
                </div>

                {/* Coluna de Produto (Compre a Solução) */}
                <div className="lg:w-5/12">
                  {section.suggestedProduct && (
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-sm sticky top-32 transition-colors duration-300">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-24 h-24 flex-shrink-0 bg-white dark:bg-gray-900 rounded-sm overflow-hidden border border-gray-100 dark:border-gray-800 p-2 transition-colors duration-300">
                          <img 
                            src={section.suggestedProduct.image} 
                            alt={section.suggestedProduct.name} 
                            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold block mb-1">
                            {t('science.ui.ideal_solution', 'A Solução Ideal')}
                          </span>
                          <h4 className="font-syne text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
                            {section.suggestedProduct.name}
                          </h4>
                          <span className="text-[10px] text-baza-lavender dark:text-baza-mint font-bold uppercase tracking-widest block">
                            {section.suggestedProduct.category}
                          </span>
                        </div>
                      </div>

                      {/* Por que funciona? (Explicação leiga) */}
                      {section.suggestedProduct.whyItWorks && (
                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2 block">
                            {t('science.ui.why_it_works', 'Por que funciona?')}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {section.suggestedProduct.whyItWorks}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        {/* CORREÇÃO: Função convertAndFormat */}
                        <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                          {convertAndFormat(section.suggestedProduct.price)}
                        </span>
                        
                        <button 
                          onClick={() => addToCart(section.suggestedProduct)}
                          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint dark:hover:text-white transition-colors duration-300 shadow-md"
                        >
                          {t('science.ui.add_btn', 'Adicionar')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          ))}
        </div>

        {/* Rodapé do Artigo */}
        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed text-center">
            {t('science.ui.disclaimer', 'As informações deste editorial têm fins estritamente educativos e traduzem a ciência dermatológica para o dia a dia. Em caso de patologias, alergias extremas ou condições inflamatórias severas, suspenda o uso de cosméticos e consulte um médico de sua confiança.')}
          </p>
        </div>
      </div>
    </div>
  );
}