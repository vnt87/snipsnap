FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine

# Install dependencies for Puppeteer and clean up in same layer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Create non-root user and required directories
RUN addgroup -S pptruser && adduser -S -G pptruser -g '' pptruser \
    && mkdir -p /home/pptruser/.cache/puppeteer \
    && mkdir -p /home/pptruser/Downloads \
    && mkdir -p /app

USER pptruser

WORKDIR /app
COPY --from=builder /app .

CMD ["node", "server.js"]