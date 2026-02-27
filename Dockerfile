# Usar imagem oficial do Node.js
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json primeiro (para cache de dependências)
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Expor porta (Render vai sobrescrever com PORT)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]