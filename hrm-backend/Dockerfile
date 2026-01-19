# Stage 1: Build
FROM node:20-slim AS builder

# Install necessary tools and update package lists
RUN apt-get update && apt-get install -y \
    build-essential \
    libgdal-dev \
    python3 \
    python3-pip \
    python3-venv

RUN rm -rf /var/lib/apt/lists/*

WORKDIR /home/node

COPY package*.json ./
RUN npm i
RUN npm install gdal-async --build-from-source --shared_gdal

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /home/node/package*.json ./
COPY --from=builder /home/node/node_modules/ ./node_modules/
COPY --from=builder /home/node/dist/ ./dist/

CMD ["node", "dist/server.js"]
EXPOSE 5201
