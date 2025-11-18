FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve để serve static files
RUN npm install -g serve

# Copy build folder từ builder stage
COPY --from=builder /app/build ./build

EXPOSE 3000

# Serve static files trên port 3000
CMD ["serve", "-s", "build", "-l", "3000"]