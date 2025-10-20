#!/bin/bash

python manage.py makemigrations --noinput
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn core.asgi:application -k uvicorn_worker.UvicornWorker -w 4 -b 0.0.0.0:8000
