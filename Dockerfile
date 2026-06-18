# ============================================================
# Stage 1 — BUILD
# ============================================================
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY ascendo-os/package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Copy the rest of the source code
COPY ascendo-os/ .

# Build the Angular app in production mode
RUN ng build --configuration production

# ============================================================
# Stage 2 — SERVE
# ============================================================
FROM nginx:alpine

# Remove default NGINX content
RUN rm -rf /usr/share/nginx/html/*

# Copy the production build from the build stage
COPY --from=build /app/dist/ascendo-os/browser /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY ascendo-os/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
