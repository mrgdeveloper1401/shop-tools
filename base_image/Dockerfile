FROM docker.arvancloud.ir/python:3.12.10-alpine

COPY requirements.txt .

RUN apk update && \
    apk upgrade  && \
    apk add bash && \
    pip install --index-url https://mirror-pypi.runflare.com/simple -r requirements.txt
