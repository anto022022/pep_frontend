# Stage 1: Build
FROM node:20-bullseye AS builder

WORKDIR /app

RUN corepack enable

# Set reliable registry + retry configs to avoid ETIMEDOUT/ECONNRESET
RUN pnpm config set registry https://registry.npmjs.org/ \
    && pnpm config set fetch-retries 5 \
    && pnpm config set fetch-retry-factor 2 \
    && pnpm config set fetch-retry-mintimeout 20000 \
    && pnpm config set fetch-retry-maxtimeout 120000

# Copy dependency files first for caching
COPY pnpm-lock.yaml package.json ./

# Install all dependencies (including dev) for build
RUN pnpm install

# Copy environment variables for build-time
COPY .env* ./

# Copy source code
COPY . .

# Build Next.js app
RUN pnpm build


# Stage 2: Production
FROM node:20-bullseye AS runner

WORKDIR /app

RUN corepack enable

# Copy only the needed production files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Set default environment variables
ENV NEXT_PUBLIC_API_BASE_URL=https://api.sandbox.pepagora.org/
ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]
