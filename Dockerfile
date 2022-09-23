FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN yarn prisma generate && npm run build

EXPOSE 3333

CMD [ "node", "dist/main.js" ]
