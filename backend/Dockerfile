# ==========================================
# 🏗️ ESTÁGIO 1: BUILDER (Ambiente de Construção)
# ==========================================
FROM node:22-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma/

# Instala TODAS as dependências (incluindo as de desenvolvimento)
RUN npm ci

# Gera os binários do Prisma Client
RUN npx prisma generate

# Copia o resto do código-fonte
COPY . .

# ==========================================
# 🚀 ESTÁGIO 2: RUNNER (Ambiente de Produção)
# ==========================================
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

# Define a variável de ambiente como produção (otimiza o Node e Express)
ENV NODE_ENV=production

# Copia apenas o package.json
COPY package*.json ./

# Instala APENAS dependências de produção (ignora eslint, nodemon, etc)
RUN npm ci --omit=dev

# Copia o Prisma gerado no estágio anterior
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copia o seu código modular recém-criado
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/server.js ./

# 🛡️ SEGURANÇA: Executa o contêiner com o usuário 'node' nativo, sem privilégios de root
USER node

EXPOSE 3000

CMD ["node", "server.js"]