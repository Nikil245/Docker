FROM node:18-alpine

WORKDIR /app

# Copy package files explicitly (no glob pattern)
COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
