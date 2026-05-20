FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN mkdir -p src/uploads/certificates

EXPOSE 5000

CMD ["npm", "start"]