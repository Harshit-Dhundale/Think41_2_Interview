# frontend/Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# Copy rest of the frontend
COPY frontend/ ./

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
