FROM docker.arvancloud.ir/node:24-slim

WORKDIR /home/app

COPY . .

#RUN rm /etc/apt/sources.list.d/* && \
#    echo "deb http://mirror.mobinhost.com/debian/ trixie main" > "/etc/apt/sources.list.d/debian.list" && \
#    apt update &&  \
#    apt upgrade -y && \
#    apt install curl vim procps && \
#    npm install -D typescript && \
#    npm i

RUN apt update &&  \
    apt upgrade -y && \
    apt install curl vim procps && \
    npm install -D typescript && \
    npm i
