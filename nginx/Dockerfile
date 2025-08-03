FROM docker.arvancloud.ir/nginx:1.27.5-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/letsencrypt/live/gstoolos/
COPY ./gstoolos/fullchain1.pem /etc/letsencrypt/live/gstoolos/
COPY ./gstoolos/privkey1.pem /etc/letsencrypt/live/gstoolos/

COPY ./gstoolos/ssl-dhparams.pem /etc/letsencrypt/
COPY ./gstoolos/options-ssl-nginx.conf /etc/letsencrypt/
