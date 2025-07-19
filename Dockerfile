FROM gs_tools:1.0.0

WORKDIR /home/app

COPY . .

RUN pip install --index-url https://mirror-pypi.runflare.com/simple colorlog