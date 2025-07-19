FROM docker.arvancloud.ir/nginx:1.27.5-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/letsencrypt/live/gstoolos

COPY ./codeima /etc/letsencrypt/live/gstoolos