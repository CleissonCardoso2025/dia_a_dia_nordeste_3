# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependências (camada em cache separada)
COPY package*.json ./
RUN npm install

# Copiar código-fonte
COPY . .

# Aceitar variáveis de ambiente do Dokploy no momento do build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_BASE_URL
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

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
