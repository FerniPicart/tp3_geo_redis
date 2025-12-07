# Imagen base de Node
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json e instalamos dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos Next.js
RUN npm run build

# Exponemos el puerto
EXPOSE 3000

# Comando para ejecutar la app en producción
CMD ["npm", "start"]
