# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install git for versioning
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy API package files and install dependencies
COPY apps/api/package*.json ./apps/api/
WORKDIR /app/apps/api
RUN npm install

# Copy entire monorepo and build the API
WORKDIR /app
COPY . .
RUN node scripts/generate-version.js
WORKDIR /app/apps/api
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app/apps/api

# Copy built assets and node_modules from builder
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.js"]
