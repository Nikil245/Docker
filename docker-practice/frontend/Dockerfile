# Use official nginx image to serve static files
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy frontend files to nginx's serve directory
COPY index.html /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# nginx starts automatically
CMD ["nginx", "-g", "daemon off;"]
