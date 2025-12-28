FROM node:lts-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the app
RUN npm run build

# Expose port 
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]

# Setup Nginx server to serve app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]