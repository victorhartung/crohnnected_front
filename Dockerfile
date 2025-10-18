
# Multi-stage build for production optimization
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production

# Copy package files
COPY package.json yarn.lock* ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]