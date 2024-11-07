FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências usando npm ci
RUN npm ci

# Copiar todo o código fonte
COPY . .

# Expor a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar o servidor em modo de desenvolvimento
CMD ["npm", "run", "dev"]
