FROM docker.arvancloud.ir/node:24-slim

WORKDIR /home/app

COPY . .

RUN apt update &&  \
    apt upgrade -y && \
    apt install curl vim procps -y && \
    npm install -D typescript && \
    npm i
