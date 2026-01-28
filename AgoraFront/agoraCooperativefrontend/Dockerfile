# 1. Étape de Build (Node.js)
FROM node:20-alpine as build-step
WORKDIR /app
COPY package*.json ./

# AJOUT DU FLAG --legacy-peer-deps POUR RÉGLER LE CONFLIT DE VERSIONS
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build --configuration=production

# 2. Étape de Production (Nginx)
FROM nginx:alpine

# On copie le résultat du build. 
COPY --from=build-step /app/dist/agoraCooperativefrontend/browser /usr/share/nginx/html

# Configuration Nginx pour gérer le routing d'Angular (SPA)
RUN printf 'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]