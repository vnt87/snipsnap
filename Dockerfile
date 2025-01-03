FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine

# Install dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Create non-root user and set permissions
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

WORKDIR /app
COPY --from=builder /app .
COPY . .

# Change ownership of the app files
RUN chown -R pptruser:pptruser /app

USER pptruser

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]