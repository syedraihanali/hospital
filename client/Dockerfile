# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Copy application files
COPY . .

# Build Next.js application
RUN npm run build

# Remove development dependencies to optimize runtime image
RUN npm prune --omit=dev

EXPOSE 3000

ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["npm", "run", "start"]
