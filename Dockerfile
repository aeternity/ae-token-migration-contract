FROM node:latest

RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN npm install -g truffle
COPY . /usr/src/app

