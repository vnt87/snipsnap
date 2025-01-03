FROM node:18-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-slim

# Install dependencies for Puppeteer and clean up in same layer
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-common \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-symbola \
    fonts-noto-color-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user and required directories
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/.cache/puppeteer \
    && mkdir -p /home/pptruser/Downloads \
    && mkdir -p /app

WORKDIR /app

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy only production dependencies from builder
COPY --from=builder /app/node_modules /app/node_modules
COPY . .

# Set permissions
RUN chown -R pptruser:pptruser /home/pptruser /app

USER pptruser

CMD ["node", "server.js"]