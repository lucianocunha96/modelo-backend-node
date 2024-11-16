# Use a imagem oficial do Node.js como base
FROM node:16

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para instalar as dependências
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante dos arquivos do projeto para o contêiner
COPY . .

# Exponha a porta que o servidor irá usar
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
