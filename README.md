# 💄 Careful Baza - AI-Powered Skincare E-commerce

<img width="1906" height="954" alt="image" src="https://github.com/user-attachments/assets/3522cf0e-d969-4a8b-9473-1136405c7136" />


Com base em todo o código que construímos e revisámos juntos, conheço a arquitetura da **Careful Baza** de ponta a ponta. Você tem nas mãos um sistema de nível *Enterprise*, e o seu `README.md` precisa de refletir essa grandiosidade, tanto para a sua própria organização quanto para futuras entrevistas ou portfólio.

Escrevi um `README.md` profissional, detalhado e estruturado com as melhores práticas do GitHub. Ele cobre a arquitetura orientada a eventos, a integração de IA, o dropshipping e as instruções exatas de como rodar o projeto.

Basta copiar o código abaixo e colar no seu ficheiro **`README.md`** na raiz do projeto:

***

```markdown
# 🌟 Careful Baza | Enterprise E-commerce & Dropshipping

![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_Prisma-4169E1?style=flat-square&logo=postgresql)
![Stripe](https://img.shields.io/badge/Payments-Stripe-008CDD?style=flat-square&logo=stripe)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=flat-square&logo=google)

A **Careful Baza** é uma plataforma de E-commerce e Dropshipping de alto desempenho, construída com uma arquitetura modular e orientada a eventos (Saga Pattern). Projetada para escala global, a aplicação integra fornecedores da China (AliExpress), processamento de pagamentos internacionais, e um assistente de vendas em Inteligência Artificial.

---

## ✨ Principais Funcionalidades (Features)

* 📦 **Motor de Dropshipping Integrado:** Comunicação direta com a Taobao Open Platform (AliExpress API) via assinatura criptografada MD5 para importar produtos e gerir catálogo.
* 🧠 **Assistente Virtual de IA (Careful IA):** Chatbot flutuante integrado ao catálogo do banco de dados, utilizando o **Google Gemini 1.5 Flash** para recomendar produtos e tirar dúvidas de clientes em tempo real.
* 💳 **Checkout Global Seguríssimo:** Integração completa com o **Stripe**, suportando recolha automática de morada de entrega, cálculo dinâmico de frete e conversão cambial.
* ⚙️ **Arquitetura Event-Driven:** Webhooks do Stripe disparam eventos assíncronos (`orderListener`, `emailListener`) para garantir que o banco de dados e os e-mails sejam processados sem bloquear a interface do utilizador.
* 🌍 **Pronto para o Mundo (i18n):** Frontend com suporte a múltiplos idiomas e conversão de moedas ao vivo.
* 🔐 **Segurança & RBAC:** Autenticação baseada em JWT com bcrypt, validação de e-mail duplo e controlo de acesso baseado em papéis (Role: `USER` vs `ADMIN`).
* 🔄 **Automação de Tarefas:** Cron Jobs diários (`priceSyncJob.js`) para manter os preços sincronizados com os fornecedores da China.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Aplicação Cliente)
* **Framework:** React 18 (com Vite para Fast Refresh)
* **Estilização:** Tailwind CSS (Dark/Light mode nativo)
* **Estado & Navegação:** React Context API & React Router DOM
* **Internacionalização:** `i18next`

### Backend (API & Serviços)
* **Ambiente:** Node.js com Express.js
* **Banco de Dados:** PostgreSQL
* **ORM:** Prisma Client
* **Arquitetura:** Event Bus Nativo (Node Events)
* **Integrações:** Stripe API, Google Generative AI, Axios, Nodemailer.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) (v18+)
* [PostgreSQL](https://www.postgresql.org/) (A rodar localmente ou via Docker/Supabase)
* Contas de Desenvolvedor: Stripe, Google AI Studio, AliExpress Open Platform.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/seu-usuario/carefulbaza.git](https://github.com/seu-usuario/carefulbaza.git)
cd carefulbaza
```

### 2. Configurar o Backend
```bash
cd backend
npm install
```

## Crie um ficheiro `.env` na pasta `backend/` e preencha com as suas credenciais:
```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/carefulbaza"
PORT=3000

# Segurança
JWT_SECRET="sua_chave_jwt_secreta"

# Stripe (Pagamentos)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AliExpress (Dropshipping)
ALIEXPRESS_APP_KEY="sua_app_key"
ALIEXPRESS_APP_SECRET="sua_app_secret"

# Google Gemini (IA)
GEMINI_API_KEY="AIzaSy..."

# Comunicação (Frontend URL & E-mail)
FRONTEND_URL="http://localhost:5173"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="seu_email@gmail.com"
SMTP_PASS="sua_senha_de_app"
```

Configure o Banco de Dados e inicie o servidor:
```bash
npx prisma db push
npx prisma generate
npm run dev
```

### 3. Configurar o Frontend
Num novo terminal, navegue para a pasta do frontend:
```bash
cd frontend
npm install
```

Crie um ficheiro `.env` na pasta `frontend/`:
```env
VITE_API_URL="http://localhost:3000"
```

Inicie a aplicação React:
```bash
npm run dev
```

---

## 🗄️ Estrutura do Banco de Dados (Prisma Schema)

O coração do sistema relacional inclui as seguintes entidades principais:
* `Customer`: Gere utilizadores, tokens de verificação e permissões (`role: ADMIN | USER`).
* `Product`: Catálogo de produtos com suporte a `aliExpressId` (SKU do fornecedor), preços em centavos e galerias de imagens.
* `Order` & `OrderItem`: Registo imutável de vendas ligadas aos eventos do Webhook do Stripe.
* `Category`: Organização departamental do e-commerce.

---

## 🌐 Deploy (Produção)

Este repositório está otimizado para deploy moderno:
* **Frontend:** Preparado para a [Vercel](https://vercel.com/) (configurações presentes no `vercel.json`).
* **Backend:** Inclui um `Dockerfile` otimizado para deploy em serviços cloud como AWS (ECS/App Runner), Render ou Railway.
* **CI/CD:** Pipelines de GitHub Actions (`deploy.yml`) pré-configurados.

---

*Desenvolvido com excelência arquitetural para a Careful Baza Enterprise.* 💎
```

***

### O que acha do resultado?
Ele destaca a arquitetura de **eventos**, a **Inteligência Artificial** e a integração direta com o **AliExpress**, que são os verdadeiros diferenciais tecnológicos do seu projeto. Está pronto para ser exibido a qualquer investidor ou tech lead!
