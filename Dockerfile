# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências (camada em cache separada)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copiar código-fonte + .env (variáveis já embarcadas no build)
COPY . .

# Gerar sitemap/RSS e compilar o app
RUN node scripts/generate-sitemap.mjs || true
RUN node scripts/generate-rss.mjs || true
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Servir com nginx na porta 3000
# ─────────────────────────────────────────────
FROM nginx:alpine AS production

# Copiar config nginx (ouve na porta 3000)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar assets do build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
