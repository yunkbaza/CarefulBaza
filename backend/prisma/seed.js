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
  // Apaga os dados antigos pela ordem correta para não quebrar as relações
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.category.deleteMany();
  console.log('✨ Base limpa! A preparar o novo catálogo Oficial da Careful Baza...');

  // ==========================================
  // 1. CATEGORIAS (Oficiais do Menu)
  // ==========================================
  const catSkincare = await prisma.category.create({ data: { name: 'Skincare', description: 'Tratamentos faciais de alta performance.' }});
  const catFragrancias = await prisma.category.create({ data: { name: 'Fragrâncias', description: 'Aromas exclusivos e sofisticados.' }});
  const catBanho = await prisma.category.create({ data: { name: 'Banho e Corpo', description: 'Hidratação profunda para o corpo.' }});
  const catKits = await prisma.category.create({ data: { name: 'Kits e Presentes', description: 'Rotinas completas para a sua pele.' }});

  // ==========================================
  // 2. PRODUTOS OFICIAIS (Com imagens HD)
  // ==========================================
  const produtos = [
    {
      name: 'Sérum Renovador Niacinamida',
      description: 'Uma dose clínica de 10% que garante resultados visíveis em 14 dias para poros e textura irregular, com zero ardência. A Niacinamida age como um escudo que protege as células contra o escurecimento de manchas causado pela radiação e poluição diária.',
      price: 14990, // R$ 149,90
      compareAtPrice: 18990,
      stock: 150,
      categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Hidratante Aqua Glow',
      description: 'Combina Ácido Hialurônico (para puxar água) e Ceramidas (para trancar essa água lá dentro), restaurando o conforto no primeiro uso. Usado como último passo da noite, ele cria um "cobertor" invisível sobre a pele, impedindo que a água e os séruns evaporem enquanto você dorme.',
      price: 12990, // R$ 129,90
      compareAtPrice: null,
      stock: 80,
      categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Óleo Reparador Botânico',
      description: 'Os óleos vegetais densos agem como uma "cola" para as telhas do cabelo, selando as cutículas e impedindo a umidade de escapar ao longo do dia. Ideal para cabelos porosos ou danificados.',
      price: 17990, // R$ 179,90
      compareAtPrice: 21990,
      stock: 45,
      categoryId: catBanho.id,
      image: 'https://images.unsplash.com/photo-1628556859345-0d676837dff9?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Essência Noturna Retinol',
      description: 'Envelopamos o ativo em nanocápsulas. Ele entra na pele e só se abre lá no fundo, garantindo colágeno novo sem deixar o rosto vermelho. O único ativo provado por cientistas que realmente reverte o envelhecimento.',
      price: 19990, // R$ 199,90
      compareAtPrice: null,
      stock: 120,
      categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Bruma Calmante Revitalizante',
      description: 'Seus prebióticos botânicos alimentam as "bactérias boas" da pele, criando uma camada protetora que reduz a vermelhidão na mesma hora. Sendo 100% livre de silicones pesados, também pode ser usada para desembaraçar o cabelo fino trazendo maciez.',
      price: 9990, // R$ 99,90
      compareAtPrice: null,
      stock: 200,
      categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Perfume Sólido Amadeirado',
      description: 'A elegância reimaginada num formato portátil. Uma fragrância sólida que derrete com o calor do corpo, libertando notas profundas. Discreto, íntimo e incrivelmente sofisticado, criado para durar na pele, não no ar.',
      price: 11990, // R$ 119,90
      compareAtPrice: null,
      stock: 60,
      categoryId: catFragrancias.id,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Espuma de Limpeza Purificante',
      description: 'O primeiro passo para a pureza. Uma espuma densa e aveludada que atua como um íman para as impurezas, poluentes e excesso de sebo. Purifica profundamente os poros preservando a proteção natural.',
      price: 8990, // R$ 89,90
      compareAtPrice: null,
      stock: 180,
      categoryId: catSkincare.id,
      image: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Kit Viagem Essencial',
      description: 'A sua rotina de pele não tira férias. O essencial da Careful Baza nos tamanhos perfeitos para levar consigo, garantindo hidratação e proteção em qualquer lugar.',
      price: 24990, // R$ 249,90
      compareAtPrice: 29990,
      stock: 30,
      categoryId: catKits.id,
      image: 'https://images.unsplash.com/photo-1571781526291-c477eb311dc6?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Kit Rotina Completa 5 Passos',
      description: 'O protocolo absoluto Careful Baza. A engenharia cosmética inteira ao seu dispor. Limpa, trata, hidrata e sela. Resultados visíveis e duradouros num curto espaço de tempo.',
      price: 49990, // R$ 499,90
      compareAtPrice: 65000,
      stock: 25,
      categoryId: catKits.id,
      image: 'https://images.unsplash.com/photo-1615397323755-325b30bcfa30?auto=format&fit=crop&w=800&q=80',
    }
  ];

  for (let i = 0; i < produtos.length; i++) {
    const prod = produtos[i];
    await prisma.product.create({
      data: {
        // Criamos um ID do AliExpress fictício mas único para cada produto (ex: BAZA_001)
        aliExpressId: `BAZA_00${i + 1}`,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        stock: prod.stock,
        categoryId: prod.categoryId,
        image: prod.image,
        gallery: [], // Array vazio, mas presente para o Frontend não quebrar
        isActive: true
      }
    });
  }
  console.log(`✅ ${produtos.length} Produtos Oficiais adicionados com sucesso!`);

  // ==========================================
  // 3. CLIENTES PARA TESTE DE LOGIN
  // ==========================================
  const senhaPadrao = await bcrypt.hash('senha123', 10); 

  const clienteAllan = await prisma.customer.create({
    data: { 
      name: 'Allan Baza', 
      email: 'allan@baza.com', 
      password: senhaPadrao, 
      phone: '11999999999'
      // Removido o isVerified caso a sua base de dados atual não tenha essa coluna
    }
  });

  const clienteTeste = await prisma.customer.create({
    data: { 
      name: 'Cliente Teste', 
      email: 'cliente@teste.com', 
      password: senhaPadrao
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
  console.log('🚀 TUDO PRONTO! A sua loja está completa e sem imagens vazias.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });