FROM node:alpine

WORKDIR  /app

COPY package*.json  ./

RUN npm install

COPY . .
COPY .env.dev .env

EXPOSE 5173

CMD [ "npm", "run", "dev" ]