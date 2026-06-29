# ---- Stage: Base Image ----
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (layer caching optimization)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
