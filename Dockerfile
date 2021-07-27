FROM node:14

WORKDIR /app

RUN npm i npm@latest -g

RUN npm cache clean --force

RUN rm -rf ~/.npm

RUN npm i -g nodemon
COPY . .

RUN npm install

EXPOSE 8000
