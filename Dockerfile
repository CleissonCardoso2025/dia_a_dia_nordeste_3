# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências primeiro (cache layer)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copiar código-fonte
COPY . .

# Gerar sitemap e build de produção
RUN node scripts/generate-sitemap.mjs || true
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Servir com nginx
# ─────────────────────────────────────────────
FROM nginx:alpine AS production

# Copiar config nginx customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
