FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY scripts ./scripts
COPY src ./src
RUN npm run build
ENV NODE_ENV=production
USER node
CMD ["node", "dist/app.js"]
