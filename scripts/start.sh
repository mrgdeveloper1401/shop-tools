#!/bin/bash

source $HOME/.local/bin/env
uv run python manage.py makemigrations --noinput
uv run python manage.py migrate
uv run python manage.py collectstatic --noinput
uv run gunicorn core.asgi:application -k uvicorn_worker.UvicornWorker -w 3 -b 0.0.0.0:8000
