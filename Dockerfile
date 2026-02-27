# Usar imagem oficial do Node.js
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json primeiro (para cache de dependências)
COPY package.json ./

# Instalar dependências (usando npm install pois não temos package-lock.json)
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta (Render vai sobrescrever com PORT)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]