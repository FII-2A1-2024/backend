FROM node

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/ 

COPY .env ./

COPY ./src/config/ ./config/

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "server"]