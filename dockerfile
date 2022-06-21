FROM node:lts-alpine
COPY package*.json ./
WORKDIR /usr/src/app
COPY ./observatory .
EXPOSE 3000
RUN npm install
CMD [ "npm", "run", "dev" ]
