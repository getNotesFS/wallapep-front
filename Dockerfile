# Etapa de construcción
FROM node:18.18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG REACT_APP_BACKEND_BASE_URL
ENV REACT_APP_BACKEND_BASE_URL=${REACT_APP_BACKEND_BASE_URL}

RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copia tu archivo de configuración de Nginx al contenedor
COPY /config-nginx/my_nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
