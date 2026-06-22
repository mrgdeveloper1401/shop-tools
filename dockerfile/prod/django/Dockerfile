FROM gs_tools:9.0.0

WORKDIR /home/app

COPY . .

# for use celery pickle
ENV C_FORCE_ROOT=1

ENTRYPOINT [ "/home/app/dockerfile/prod/django/scripts/start.sh" ]