from celery import Celery
from decouple import config
import os

DEBUG = config('DEBUG', default=False, cast=bool)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', "core.settings")

app = Celery('core.utils')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
