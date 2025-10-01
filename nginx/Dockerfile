FROM docker.arvancloud.ir/nginx:1.27.5-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/letsencrypt/live/api.gs-tools.ir/

COPY ./api.gs-tools.ir/fullchain1.pem /etc/letsencrypt/live/api.gs-tools.ir/

COPY ./api.gs-tools.ir//privkey1.pem /etc/letsencrypt/live/api.gs-tools.ir/

COPY ./api.gs-tools.ir//ssl-dhparams.pem /etc/letsencrypt/

COPY ./api.gs-tools.ir/options-ssl-nginx.conf /etc/letsencrypt/
