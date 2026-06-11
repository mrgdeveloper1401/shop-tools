FROM docker.arvancloud.ir/nginx:1.29-alpine

RUN cp /dev/null /etc/apk/repositories && \
    mkdir -p /var/www/static/ && \
    mkdir -p /etc/letsencrypt/ && \
    echo "https://mirror.mobinhost.com/alpine/v3.22/main" >> /etc/apk/repositories && \
    echo "https://mirror.mobinhost.com/alpine/v3.22/community" >> /etc/apk/repositories && \
    apk update && \
    apk upgrade && \
    apk add bash curl openssl

# base_image gs-nginx:1.0.0