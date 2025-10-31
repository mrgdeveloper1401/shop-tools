FROM docker.arvancloud.ir/python:3.12.10-alpine

COPY requirements.txt .

RUN cp /dev/null /etc/apk/repositories && \
    echo "https://mirror.mobinhost.com/alpine/v3.22/main" >> /etc/apk/repositories && \
    echo "https://mirror.mobinhost.com/alpine/v3.22/community" >> /etc/apk/repositories && \
    apk update && \
    apk upgrade && \
    apk add --no-cache bash postgresql16-client curl && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    export PATH="/root/.cargo/bin:$PATH" && \
    uv pip install --system -r requirements.txt
    # pip install --index-url https://mirror-pypi.runflare.com/simple --upgrade pip && \
    # pip install --index-url https://mirror-pypi.runflare.com/simple -r requirements.txt

ENV PATH="/root/.cargo/bin:$PATH"