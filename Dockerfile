FROM node:18

# создание директории приложения
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm i


COPY . .
RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]