# Etapa base
FROM node:latest

# Criar diretório da aplicação
WORKDIR /src

# Copiar arquivos do projeto
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos
COPY . .

# Expor a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
