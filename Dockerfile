FROM gs_tools:8.0.0

WORKDIR /home/app

COPY . .

# for use celery pickle
ENV C_FORCE_ROOT=1
