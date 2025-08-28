# Usa la imagen oficial de Node.js
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install --production

# Copia el resto del código
COPY . .

# Construye la app
RUN npm run build

# Expone el puerto que usará la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
