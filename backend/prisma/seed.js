require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Limpando a base de dados antiga...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.category.deleteMany();
  console.log('✨ Base limpa! A preparar o novo catálogo de Alta Performance...');

  // ==========================================
  // 1. CATEGORIAS
  // ==========================================
  const catSkincare = await prisma.category.create({ data: { name: 'Skincare', description: 'Tratamentos de alta performance' }});
  const catFragrancias = await prisma.category.create({ data: { name: 'Fragrâncias', description: 'Aromas exclusivos e duradouros' }});
  const catBanho = await prisma.category.create({ data: { name: 'Banho e Corpo', description: 'Rituais de autocuidado' }});
  const catMasculino = await prisma.category.create({ data: { name: 'Masculino', description: 'Praticidade e eficácia' }});
  const catKits = await prisma.category.create({ data: { name: 'Kits', description: 'Rotinas completas com desconto' }});

  // ==========================================
  // 2. PRODUTOS (COM COPY DE LUXO E RITUAL DE USO)
  // ==========================================
  const produtos = [
    {
      name: 'Sérum Renovador Niacinamida',
      description: 'Uma infusão clínica de alta potência desenhada para transformar a textura da pele. Formulado com Niacinamida pura, este sérum atua diretamente na raiz dos poros dilatados e da produção irregular de sebo. O resultado é uma tez visivelmente mais uniforme, luminosa e com manchas atenuadas, proporcionando o cobiçado efeito "Glass Skin" sem agredir a barreira de proteção natural.',
      howToUse: 'Pela manhã e à noite, após a limpeza, dispense 3 a 4 gotas nas pontas dos dedos. Pressione suavemente sobre o rosto e pescoço, evitando esfregar. Aguarde a absorção completa antes do próximo passo.',
      price: 18990, compareAtPrice: 24990, stock: 150, categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbce5ce?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Hidratante Aqua Glow',
      description: 'Uma revolução em hidratação. A sua textura em gel-creme ultraleve derrete ao entrar em contacto com a pele, libertando micro-cápsulas de Ácido Hialurónico e Ceramidas. Retém a humidade por 48 horas, preenchendo as linhas finas de desidratação e deixando um viço radiante, sem qualquer sensação pesada ou pegajosa.',
      howToUse: 'Utilize como o último passo da sua rotina (antes do protetor solar de dia). Aplique uma quantidade do tamanho de uma ervilha e espalhe com movimentos circulares ascendentes.',
      price: 14500, compareAtPrice: null, stock: 80, categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Essência Noturna Retinol',
      description: 'O verdadeiro arquiteto do rejuvenescimento. Utilizamos uma tecnologia de encapsulamento inteligente que liberta o Retinol gradualmente durante a noite. Esta essência acelera a renovação celular, estimula a produção de colagénio e apaga os danos acumulados pelo tempo, garantindo que acorde com uma pele mais firme e descansada.',
      howToUse: 'Uso exclusivamente noturno. Aplique 2 a 3 gotas sobre a pele limpa e seca. Se for a sua primeira vez com Retinol, inicie o uso em dias alternados para a pele criar tolerância.',
      price: 25000, compareAtPrice: 31000, stock: 45, categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Bruma Calmante Revitalizante',
      description: 'Um resgate botânico imediato encapsulado num spray ultrafino. Rica em prebióticos e extratos de Centelha Asiática, esta bruma age como um escudo invisível que acalma a vermelhidão, reduz a temperatura da pele e restaura o microbioma em segundos. O companheiro perfeito para peles reativas.',
      howToUse: 'Borrife a 20cm do rosto sempre que sentir a pele repuxar, arder ou precisar de frescor. Pode ser usada antes do hidratante ou por cima da maquilhagem ao longo do dia.',
      price: 11000, compareAtPrice: null, stock: 200, categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Creme Iluminador para Olhos',
      description: 'Desperte o seu olhar com esta fórmula energizante. Enriquecido com Cafeína Pura e Vitamina C estabilizada, este creme ataca a pigmentação das olheiras e o inchaço matinal. O seu aplicador de metal cirúrgico proporciona uma massagem criogénica que estimula a drenagem linfática instantaneamente.',
      howToUse: 'Aperte suavemente a bisnaga e use o aplicador de metal para espalhar o produto no contorno dos olhos. Dê leves batidinhas com o dedo anelar até a absorção total.',
      price: 16500, compareAtPrice: 19500, stock: 60, categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1571781926291-c477eb31f801?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Espuma de Limpeza Purificante',
      description: 'O primeiro passo para a pureza. Uma espuma densa e aveludada que atua como um íman para as impurezas, poluentes e excesso de sebo. Formulado sem sulfatos agressivos, purifica profundamente os poros preservando o manto hidrolipídico, deixando a pele incrivelmente macia e respirável.',
      howToUse: 'Massageie um pump de espuma sobre o rosto húmido por 60 segundos, focando na zona T. Enxague abundantemente com água fria ou morna.',
      price: 8990, compareAtPrice: null, stock: 300, categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1556228722-dca92acbe5fc?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Perfume Sólido Amadeirado',
      description: 'A elegância reimaginada num formato portátil. Uma fragrância sólida que derrete com o calor do corpo, libertando notas profundas de Sândalo, Cedro e um toque de especiarias quentes. Discreto, íntimo e incrivelmente sofisticado, criado para durar na pele, não no ar.',
      howToUse: 'Deslize o dedo sobre a cera e aplique nos pontos de pulsação: pulsos, pescoço e atrás das orelhas. Reaplique durante o dia conforme desejar.',
      price: 19500, compareAtPrice: null, stock: 40, categoryId: catFragrancias.id,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Água de Colônia Cítrica',
      description: 'Uma explosão de vitalidade engarrafada. As notas de topo de Bergamota Italiana e Limão Siciliano fundem-se com um coração suave de flor de laranjeira. É o aroma perfeito para despertar os sentidos de manhã e prolongar a sensação de banho tomado o dia inteiro.',
      howToUse: 'Borrife generosamente sobre o corpo após o banho. Para maior fixação, aplique sobre a pele previamente hidratada.',
      price: 14000, compareAtPrice: 18000, stock: 90, categoryId: catFragrancias.id,
      image: 'https://images.unsplash.com/photo-1585365321839-444f0ce64522?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Óleo Reparador Botânico',
      description: 'O ouro líquido da nossa curadoria. Uma mistura luxuosa de Óleo de Jojoba, Rosa Mosqueta e Esqualano que envolve o corpo numa hidratação profunda sem deixar resíduos gordurosos. Ilumina a pele com um brilho saudável e repara áreas extremamente secas numa única aplicação.',
      howToUse: 'Após o banho, com a pele ainda ligeiramente húmida, massageie o óleo por todo o corpo para "trancar" a hidratação. Insista nos cotovelos e joelhos.',
      price: 21000, compareAtPrice: null, stock: 75, categoryId: catBanho.id,
      image: 'https://images.unsplash.com/photo-1615397323861-125026210f84?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Gel de Banho Energizante',
      description: 'Transforme o seu banho numa experiência de SPA. Este gel cria uma espuma rica que limpa com suavidade enquanto os óleos essenciais de menta e eucalipto desobstruem as vias respiratórias e aliviam a tensão muscular do dia a dia.',
      howToUse: 'Aplique nas mãos ou numa esponja, massageando sobre o corpo húmido até formar espuma. Inspire profundamente os aromas antes de enxaguar.',
      price: 7500, compareAtPrice: 9500, stock: 120, categoryId: catBanho.id,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Sérum Pós-Barba Calmante',
      description: 'O fim da irritação pós-corte. Formulado com Aloe Vera concentrada e extrato de Chá Verde, este sérum atua instantaneamente para acalmar o micro-trauma causado pelas lâminas. Previne a foliculite, fecha os poros e hidrata a pele sem adicionar qualquer brilho ou oleosidade.',
      howToUse: 'Imediatamente após o barbear, seque o rosto com uma toalha limpa e aplique 2 pumps do sérum sobre a área barbeada com movimentos descendentes.',
      price: 13500, compareAtPrice: null, stock: 85, categoryId: catMasculino.id,
      image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Gel de Limpeza Masculino 2 em 1',
      description: 'Praticidade máxima aliada a alta performance. Um gel que limpa o rosto removendo a poluição e a oleosidade, ao mesmo tempo que purifica a barba. Enriquecido com carvão ativado, atua como um detox diário para os poros.',
      howToUse: 'No banho ou no lavatório, massageie uma pequena quantidade sobre o rosto e a barba húmidos. Enxague bem.',
      price: 9900, compareAtPrice: 12000, stock: 110, categoryId: catMasculino.id,
      image: 'https://images.unsplash.com/photo-1556228721-871032df4c22?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Kit Viagem Essencial',
      description: 'O seu ritual inegociável, agora em formato travel-size aprovado para a cabine de avião. Contém as miniaturas dos nossos 3 tratamentos best-sellers para garantir que a sua pele não sofre com o ar seco dos voos ou mudanças climáticas repentinas.',
      howToUse: 'Siga os passos 1, 2 e 3 numerados nas embalagens para garantir a hidratação e proteção onde quer que você esteja no mundo.',
      price: 32000, compareAtPrice: 40000, stock: 50, categoryId: catKits.id,
      image: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Kit Rotina Completa 5 Passos',
      description: 'O protocolo definitivo desenhado pelos nossos especialistas. Uma sinergia perfeita entre limpeza, tratamento, hidratação e proteção. Ao utilizar os produtos em conjunto, os ativos potencializam-se mutuamente, garantindo resultados visíveis e duradouros num curto espaço de tempo.',
      howToUse: 'O kit acompanha um guia impresso exclusivo com o passo a passo detalhado e as ordens exatas de aplicação para a rotina da manhã e da noite.',
      price: 68000, compareAtPrice: 85000, stock: 25, categoryId: catKits.id,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
    }
  ];

  for (const prod of produtos) {
    await prisma.product.create({
      data: {
        name: prod.name,
        description: prod.description,
        howToUse: prod.howToUse, // Novo campo de Como Usar!
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        stock: prod.stock,
        categoryId: prod.categoryId,
        image: prod.image,
        supplierSku: `SKU_${Math.floor(Math.random() * 10000)}`, // Mantido do seu seed original
        gallery: [] // Mantido do seu seed original
      }
    });
  }
  console.log(`✅ ${produtos.length} Produtos Premium adicionados com sucesso!`);

  // ==========================================
  // 3. CLIENTES PARA TESTE DE LOGIN
  // ==========================================
  const senhaPadrao = await bcrypt.hash('senha123', 10); 

  const clienteAllan = await prisma.customer.create({
    data: { 
      name: 'Allan Baza', 
      email: 'allan@baza.com', 
      password: senhaPadrao, 
      phone: '11999999999',
      isVerified: true // Conta já verificada para não precisar de e-mail agora
    }
  });

  const clienteTeste = await prisma.customer.create({
    data: { 
      name: 'Cliente Teste', 
      email: 'cliente@teste.com', 
      password: senhaPadrao,
      isVerified: true // Conta já verificada
    }
  });
  console.log('✅ Clientes criados! (Email: allan@baza.com | Senha: senha123)');

  // ==========================================
  // 4. PEDIDOS DE EXEMPLO PARA O DASHBOARD
  // ==========================================
  const produtoParaPedido = await prisma.product.findFirst();

  await prisma.order.create({
    data: {
      totalAmount: produtoParaPedido.price,
      status: 'PAID',
      customerId: clienteAllan.id,
      addressLine1: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      items: { 
        create: [
          { quantity: 1, price: produtoParaPedido.price, productId: produtoParaPedido.id }
        ]
      }
    }
  });
  console.log('✅ Pedidos de teste criados!');
  console.log('🚀 TUDO PRONTO! Pode abrir a loja.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });