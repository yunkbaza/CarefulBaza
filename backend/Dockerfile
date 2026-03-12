# ==========================================
# 🏗️ ESTÁGIO 1: BUILDER (Ambiente de Construção)
# ==========================================
# Mudamos de 'alpine' para 'slim' (Debian-based) para compatibilidade 100% com Prisma
FROM node:22-slim AS builder

# Instala o OpenSSL e as ferramentas nativas que o Prisma precisa no Debian
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

# Agora o Prisma vai gerar usando o motor padrão do Linux (glibc) sem procurar o WASM
RUN npx prisma generate

COPY . .

# ==========================================
# 🚀 ESTÁGIO 2: RUNNER (Ambiente de Produção)
# ==========================================
FROM node:22-slim AS runner

# Instala o OpenSSL no ambiente de produção também
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/server.js ./

# 🛡️ SEGURANÇA: Executa sem privilégios de root
USER node

EXPOSE 3000

CMD ["node", "server.js"]