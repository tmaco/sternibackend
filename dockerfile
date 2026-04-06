# Dockerfile para Node backend / React
FROM node:20-alpine

WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install --production

# Copia el resto del código
COPY . .

# Expón el puerto que Fly espera
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["npm", "start"]
