# Usa una imagen base ligera de Node.js
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Eliminar builds viejos
RUN rm -rf dist

# Compilar la aplicación (TypeScript → JS)
RUN npm run build

# Puerto del microservicio de usuarios
EXPOSE 3001

# Comando de arranque
CMD ["npm", "run", "start:prod"]
