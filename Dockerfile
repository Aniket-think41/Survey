# =========================
# Stage 1: Build React app
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for better Docker caching
COPY package*.json ./

# Install exact dependencies from package-lock.json
RUN npm ci

# Copy application source
COPY . .

# Build Vite application
RUN npm run build


# =========================
# Stage 2: Production server
# =========================
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy React production build
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx configuration for React SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Render provides PORT dynamically
EXPOSE 10000

# Replace PORT in nginx config and start nginx
CMD ["sh", "-c", "sed -i \"s/\\$PORT/${PORT:-10000}/g\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
