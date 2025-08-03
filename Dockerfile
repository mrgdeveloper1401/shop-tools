FROM gs_tools:1.0.0

WORKDIR /home/app

COPY . .

RUN pip install --index-url https://mirror-pypi.runflare.com/simple colorlog && \
    pip install --index-url https://mirror-pypi.runflare.com/simple drf-spectacular[sidecar] && \
    pip install --index-url https://mirror-pypi.runflare.com/simple django-extensions && \
    pip install --index-url https://mirror-pypi.runflare.com/simple openpyxl && \
    pip install --index-url https://mirror-pypi.runflare.com/simple drf-extensions && \
    pip install --index-url https://mirror-pypi.runflare.com/simple ipython && \
    pip install --index-url https://mirror-pypi.runflare.com/simple pandas
