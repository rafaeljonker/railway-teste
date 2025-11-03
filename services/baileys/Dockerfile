FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Create auth directory
RUN mkdir -p /app/baileys_auth

# Expose port
EXPOSE 3000

# Start service
CMD ["npm", "start"]
