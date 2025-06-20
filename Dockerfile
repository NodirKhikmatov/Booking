# ---- Build Stage ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Copy only package.json and package-lock.json for dependency caching
    COPY package*.json ./
    
    # Use `npm ci` for reproducible builds (faster + safer in CI/CD)
    RUN npm ci
    
    # Copy remaining app files
    COPY . .
    
    # Build the project
    RUN npm run build
    
    # ---- Production Stage ----
    FROM node:20-alpine
    
    WORKDIR /app
    
    # Copy only what is needed for production
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    
    ENV NODE_ENV=production
    EXPOSE 3000
    
    # Run the built application
    CMD ["node", "dist/apps/booking/main"]
    