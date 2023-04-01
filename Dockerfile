FROM node:8-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./.env ./.env

COPY --chown=node . .
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "docker:start" ]
