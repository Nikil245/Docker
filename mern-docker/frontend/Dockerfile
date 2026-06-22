# Stage 1 — Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built React files into Nginx serving folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (nginx.conf sits inside frontend/ folder)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
