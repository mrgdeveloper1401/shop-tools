#!/bin/bash


python manage.py makemigrations --noinput
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn core.asgi:application -c /home/app/scripts/gunicorn.conf.py
