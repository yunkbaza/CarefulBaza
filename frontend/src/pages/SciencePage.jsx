import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function SciencePage() {
  const { topicId } = useParams();
  const { addToCart } = useCart();
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(data => setDbProducts(data))
      .catch(err => console.error("Erro ao carregar produtos do banco", err));
  }, []);

  // O "Cérebro" Editorial 100% COMPLETO - Apontando para os nomes REAIS dos produtos do Seed
  const CONTENT_DB = {
    'tipos-de-pele': {
      title: 'Guia Definitivo: Tipos de Pele',
      subtitle: 'Entenda a biologia do seu rosto para uma rotina de alta performance.',
      intro: 'Identificar o seu tipo de pele é o primeiro passo para parar de gastar dinheiro com produtos errados. A pele é um órgão vivo e dinâmico. Abaixo, mapeamos os perfis mais comuns e a ciência exata para os tratar.',
      sections: [
        {
          id: 'oleosa',
          title: 'Pele Oleosa e com Poros Dilatados',
          body: 'Caracterizada pela superprodução de sebo pelas glândulas sebáceas. O brilho excessivo aparece poucas horas após a lavagem e os poros ficam visíveis. O erro mais comum é lavar o rosto várias vezes ao dia com sabonetes fortes, o que remove a proteção natural e causa o "efeito rebote" (a pele entra em pânico e produz o dobro de óleo).',
          clinicalTip: 'Evite esfoliantes de bolinhas grossas. Eles geram microlesões que inflamam os poros. Prefira uma esfoliação química suave e hidratação ultraleve em gel.',
          suggestedProductName: 'Espuma de Limpeza Purificante',
          whyItWorks: 'Limpa os poros profundamente através da química botânica, reduzindo a oleosidade na hora sem causar ardência ou vermelhidão.'
        },
        {
          id: 'seca',
          title: 'Pele Seca e Barreira Comprometida',
          body: 'Ao contrário da pele desidratada (que apenas precisa de água), a pele seca não produz lipídios (óleos naturais) suficientes. Sem esse "cimento" natural, a água que você bebe evapora pela pele facilmente. Ela repuxa, tem textura áspera e descama.',
          clinicalTip: 'Nunca lave o rosto com água quente do chuveiro. A alta temperatura derrete os poucos óleos naturais que a sua pele conseguiu produzir para se defender.',
          suggestedProductName: 'Hidratante Aqua Glow',
          whyItWorks: 'Restaura a barreira com ativos idênticos aos da pele humana, selando a água dentro da célula para um conforto duradouro.'
        },
        {
          id: 'sensivel',
          title: 'Pele Sensível e Avermelhada',
          body: 'A pele sensível é uma condição de inflamação. A barreira de proteção está tão fina que o vento, cosméticos e até o stress penetram fácil, ativando alertas que geram vermelhidão e ardência. O foco aqui não é renovar, é acalmar.',
          clinicalTip: 'Adote o minimalismo (Skin Diet). Quando a pele estiver em crise a arder, suspenda os ácidos e use apenas um sabonete suave e um hidratante calmante.',
          suggestedProductName: 'Bruma Calmante Revitalizante',
          whyItWorks: 'O resgate botânico imediato que acalma os receptores de dor da pele, reduzindo o calor e a vermelhidão visível instantaneamente.'
        }
      ]
    },
    'ativos': {
      title: 'Dicionário Clínico de Ativos',
      subtitle: 'Transparência total sobre o que realmente transforma a sua pele.',
      intro: 'A indústria cosmética lucra com promessas vazias e nomes complicados. Na Careful Baza Labs, nós traduzimos a ciência para você saber exatamente no que está a investir.',
      sections: [
        {
          id: 'niacinamida',
          title: 'Niacinamida (Vitamina B3)',
          body: 'É como o "faz-tudo" do skincare. Ela clareia manchas, diminui o tamanho visual dos poros e acalma espinhas inflamadas. O melhor de tudo? Não irrita e pode ser usada sob o sol.',
          clinicalTip: 'Séruns de Niacinamida combinam com tudo. Pode misturar com Vitamina C de manhã ou Retinol à noite sem medo de dar reação.',
          suggestedProductName: 'Sérum Renovador Niacinamida',
          whyItWorks: 'Uma dose clínica que garante resultados visíveis em 14 dias para poros e textura irregular, com zero ardência.'
        },
        {
          id: 'retinol',
          title: 'Retinol (Vitamina A)',
          body: 'O único ativo provado por cientistas que realmente reverte o envelhecimento. Ele entra na célula e manda-a "trabalhar mais rápido", trocando a pele velha por uma nova.',
          clinicalTip: 'Se é iniciante no Retinol, use a técnica do "Sanduíche": Aplique hidratante, depois o Retinol, e depois hidratante por cima de novo. Isso evita descamação.',
          suggestedProductName: 'Essência Noturna Retinol',
          whyItWorks: 'Envelopamos o ativo em nanocápsulas. Ele entra na pele e só se abre lá no fundo, garantindo colágeno novo sem deixar o rosto vermelho.'
        }
      ]
    },
    'tipos-de-cabelo': {
      title: 'A Ciência da Tricologia',
      subtitle: 'Diagnosticando a saúde estrutural dos seus fios.',
      intro: 'Saber se o seu cabelo é liso ou crespo é apenas estética. Para tratar de verdade, precisamos olhar no microscópio e entender a porosidade (o nível de dano da "capa" que protege o fio).',
      sections: [
        {
          id: 'poroso',
          title: 'Cabelo Poroso e Danificado (Com Frizz)',
          body: 'Imagine o fio de cabelo como um telhado. Num cabelo saudável, as telhas (cutículas) estão bem fechadas. No cabelo poroso, as telhas estão levantadas. A água entra fácil, mas evapora em segundos, deixando o fio seco e armado.',
          clinicalTip: 'Faça o teste do copo: coloque um fio de cabelo solto num copo d\'água. Se afundar rápido, é poroso (precisa de óleo). Se ficar a boiar no topo, é pouco poroso.',
          suggestedProductName: 'Óleo Reparador Botânico',
          whyItWorks: 'Os óleos vegetais densos agem como uma "cola" para as telhas do cabelo, selando as cutículas e impedindo a humidade de escapar ao longo do dia.'
        },
        {
          id: 'fino',
          title: 'Fios Finos, Oleosos e Sem Volume',
          body: 'O cabelo fino é muito delicado e tem menos "corpo". Como o fio é muito liso e leve, a oleosidade natural que o couro cabeludo produz escorrega até às pontas muito rápido, deixando o cabelo com aspeto "murcho".',
          clinicalTip: 'A regra de ouro para cabelos finos: O condicionador nunca deve tocar do meio para cima da cabeça. Aplique apenas nas pontinhas extremas para não pesar a raiz.',
          suggestedProductName: 'Bruma Calmante Revitalizante',
          whyItWorks: 'Usada nas pontas, a sua fórmula líquida desembaraça o cabelo fino trazendo maciez, sem adicionar o peso de cremes tradicionais.'
        }
      ]
    },
    'dicas': {
      title: 'Protocolos de Rotina',
      subtitle: 'A engenharia por trás de um skincare impecável.',
      intro: 'Comprar produtos de luxo e aplicar na ordem errada deita dinheiro ao lixo. A regra universal da cosmetologia é simples: aplique sempre do produto mais líquido para o mais espesso.',
      sections: [
        {
          id: 'matinal',
          title: 'A Rotina da Manhã (Ataque & Defesa)',
          body: 'O objetivo da manhã não é tratar problemas graves, é proteger o seu rosto do sol, da poluição e da luz dos ecrãs. O protocolo correto é: 1. Limpeza Suave > 2. Antioxidante > 3. Hidratante Leve > 4. Protetor Solar.',
          clinicalTip: 'Se a sua pele for normal a seca, não precisa usar sabonete de manhã! Apenas lave o rosto com água fria. Isso salva a hidratação que a sua pele construiu enquanto dormia.',
          suggestedProductName: 'Sérum Renovador Niacinamida',
          whyItWorks: 'A Niacinamida age como um escudo que protege as células contra o stress oxidativo causado pela radiação e poluição diária.'
        },
        {
          id: 'noturna',
          title: 'A Rotina Noturna (Conserto & Reparação)',
          body: 'Durante o sono profundo, o fluxo de sangue no rosto aumenta e a pele entra em "modo reforma". Esta é a hora de colocar os ativos fortes a trabalhar. A ordem é: 1. Limpeza Profunda > 2. Tratamento Específico > 3. Creme Hidratante Rico.',
          clinicalTip: 'O segredo coreano da Limpeza Dupla (Double Cleansing): Use um produto à base de óleo primeiro para derreter a maquilhagem, e depois lave com gel para limpar os poros de verdade.',
          suggestedProductName: 'Hidratante Aqua Glow',
          whyItWorks: 'Usado como último passo da noite, ele cria um "cobertor" invisível sobre a pele, impedindo que a água e os séruns evaporem enquanto dorme.'
        }
      ]
    }
  };

  const content = CONTENT_DB[topicId] || {
    title: 'Editorial Care',
    subtitle: 'Os nossos cadernos científicos estão em atualização.',
    intro: 'Selecione uma categoria no menu "A Ciência" para aceder aos nossos artigos mais recentes.',
    sections: []
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 pb-32 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Voltar para Home
        </Link>
        <span className="text-baza-mint font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Careful Baza Labs</span>
        <h1 className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">{content.title}</h1>
        <h2 className="text-xl md:text-2xl text-baza-lavender dark:text-baza-mint font-serif italic mb-10">{content.subtitle}</h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-16 max-w-2xl transition-colors">{content.intro}</p>

        <div className="flex flex-col gap-24">
          {content.sections.map((section) => {
            // PROCURA O PRODUTO REAL NO BANCO DE DADOS
            const realProduct = dbProducts.find(p => p.name === section.suggestedProductName);

            return (
              <div key={section.id} className="scroll-mt-32 border-t border-gray-100 dark:border-gray-800 pt-12 transition-colors" id={section.id}>
                
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-7/12">
                    <h3 className="font-syne text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">{section.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-lg">{section.body}</p>
                    
                    {section.clinicalTip && (
                      <div className="bg-baza-lavender/5 dark:bg-baza-lavender/10 border-l-2 border-baza-lavender p-6 mb-8">
                        <div className="flex items-center gap-2 mb-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-baza-lavender"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          <span className="text-xs font-bold uppercase tracking-widest text-baza-lavender dark:text-baza-mint">A Dica de Ouro</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{section.clinicalTip}</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:w-5/12">
                    {/* SÓ MOSTRA SE O PRODUTO EXISTIR NO BANCO REAL */}
                    {realProduct && (
                      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-sm sticky top-32">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-24 h-24 flex-shrink-0 bg-white dark:bg-gray-900 rounded-sm overflow-hidden border border-gray-100 dark:border-gray-800 p-2">
                            <img src={realProduct.image} alt={realProduct.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block mb-1">A Solução Ideal</span>
                            <h4 className="font-syne text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{realProduct.name}</h4>
                            <span className="text-[10px] text-baza-lavender font-bold uppercase tracking-widest block">{realProduct.category?.name || 'Tratamento'}</span>
                          </div>
                        </div>

                        {section.whyItWorks && (
                          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2 block">Por que funciona?</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{section.whyItWorks}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-col">
                            {realProduct.compareAtPrice && <span className="text-xs font-mono line-through text-gray-400">R$ {realProduct.compareAtPrice.toFixed(2).replace('.', ',')}</span>}
                            <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">R$ {realProduct.price.toFixed(2).replace('.', ',')}</span>
                          </div>
                          <button 
                            onClick={() => addToCart(realProduct)}
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors shadow-md"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}