# Use the latest LTS version of Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

# ---
# Production image: only rebuild from here if builder image is cached
FROM node:20-alpine AS production
WORKDIR /app

# Copy only built files and necessary dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install vite for preview (needed to serve the built app)
RUN npm install vite

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
