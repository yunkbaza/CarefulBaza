# 💄 Careful Baza - AI-Powered Skincare E-commerce

> Plataforma de e-commerce internacional focada em skincare (dropshipping), unindo arquitetura de software de alta performance, integrações financeiras globais e *Conversational Commerce* nativo via IA.

## 🚀 Visão Geral do Projeto

O **Careful Baza** não é apenas uma loja virtual; é um sistema distribuído projetado para conversão e escala global. A arquitetura foi desenhada separando rigorosamente as responsabilidades entre um Frontend reativo (React/Vite) e um Backend robusto (Node.js), orquestrado por um pipeline de CI/CD moderno e infraestrutura em nuvem.

O grande diferencial do sistema é o motor de **Conversational Commerce**, onde agentes de IA (Google Gemini) interagem com os clientes, tiram dúvidas sobre rotinas de pele e inserem produtos no carrinho dinamicamente através de triggers estruturados (`#cart:product_id`).

## 🏗️ Arquitetura e Tech Stack

O projeto segue princípios de Clean Code, separação de responsabilidades (SoC) e preparação para microsserviços através de uma **Arquitetura Orientada a Eventos (EDA)**.

### Frontend (Client-Side)
* **Framework:** React.js com Vite (Alta performance de build e HMR).
* **Estilização:** Tailwind CSS (Design System altamente customizável e responsivo).
* **Estado e Roteamento:** Context API + React Router DOM.
* **Internacionalização:** `i18next` para suporte multi-idioma nativo.
* **Integrações:** Stripe Elements (Checkout fluido e seguro).

### Backend (Server-Side)
* **Core:** Node.js + Express.js.
* **Banco de Dados:** PostgreSQL hospedado no Neon Serverless.
* **ORM:** Prisma v7.5 (Queries tipadas e seguras, otimizadas com motor `library`).
* **Autenticação:** JWT (JSON Web Tokens) com senhas cacheadas em Bcrypt.
* **Mensageria Interna:** Padrão EventBus nativo (preparação para SAGA Pattern e filas assíncronas).
* **Inteligência Artificial:** Google Generative AI SDK (Gemini) para processamento de linguagem natural no Chatbot.

### DevOps & Infraestrutura
* **Containerização:** Docker com *Multi-stage Builds* (Imagens de produção leves e seguras baseadas em `debian-slim`).
* **CI/CD:** GitHub Actions (Build, Tagging imutável por SHA e Push automatizado).
* **Registry:** AWS Elastic Container Registry (ECR).
* **Segurança:** Execução de containers com *Least Privilege* (Usuário `node` sem root).

---

## ⚙️ Funcionalidades Principais

- [x] **Event-Driven E-mails:** Disparo de e-mails transacionais (boas-vindas, recuperação de senha) desacoplados do request principal, garantindo respostas em ms para o cliente.
- [x] **Checkout Global:** Integração com Stripe para pagamentos seguros com cartões de crédito internacionais e métodos locais (Pix, Boleto).
- [x] **AI Shopping Assistant:** Chatbot integrado ao catálogo do banco de dados que atua como consultor dermatológico de vendas.
- [x] **Multi-currency Dinâmico:** Conversão de preços em tempo real com base no câmbio (Exchange-API).
- [x] **Lead Capture Blindado:** Formulários de newsletter no footer protegidos e com feedback visual instantâneo.

---

## 🛠️ Como rodar localmente

### Pré-requisitos
* Node.js (v22+)
* Docker (Opcional, para rodar o banco local)
* Chaves de API: Stripe, Google Gemini, e um servidor SMTP (ex: Gmail App Passwords).

### Passo 1: Backend

# 1. Entre na pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# (Preencha o .env com suas chaves reais do banco de dados, Stripe, SMTP e Gemini)

# 4. Gere os binários do Prisma e suba as tabelas
npx prisma generate
npx prisma db push

# 5. Inicie o servidor em modo de desenvolvimento
npm run dev

### Passo 2: Frontend

# 1. Entre na pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Configure a URL da API no .env
echo "VITE_API_URL=http://localhost:3000/api" > .env

# 4. Inicie o Vite
npm run dev

Acesse http://localhost:5173 no seu navegador.

### 🚢 Pipeline de Deploy (CI/CD)

Este repositório possui Integração Contínua (CI) configurada via GitHub Actions.
A cada push na branch main:

O ambiente de execução é provisionado.

O Docker realiza o build em múltiplos estágios (Node 22 Slim + Prisma).

A imagem recebe uma tag única baseada no hash do commit (${{ github.sha }}) garantindo rastreabilidade e facilidade de rollback.

A imagem é enviada (Push) diretamente para o AWS ECR.

Projeto desenvolvido com foco em escalabilidade, resiliência corporativa e experiência do usuário internacional.

Obrigado pela atenção e interesse!!
