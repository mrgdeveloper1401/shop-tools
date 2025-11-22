from datetime import timedelta
from pathlib import Path
import os
from kombu import Queue

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = True

SECRET_KEY = 'django-insecure-bpg-62bxjk+m1fotiez1b#oi295y!r!)k!*&er0lj3b1h_cw_e'

ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = [
    # buil in django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # third party package
    "rest_framework",
    "django_ckeditor_5",
    "drf_spectacular",
    "drf_spectacular_sidecar",
    "rest_framework_simplejwt",
    "django_filters",
    "django_extensions",
    "treebeard",
    "django_json_widget",
    "daterangefilter",
    "rest_framework_simplejwt.token_blacklist",
    "django_celery_beat",
    "adrf",
    "debug_toolbar",
    "django_async_orm",

    # third party app
    "account_app.apps.AccountAppConfig",
    "product_app.apps.ProductAppConfig",
    "blog_app.apps.BlogAppConfig",
    "core_app.apps.CoreAppConfig",
    "order_app.apps.OrderAppConfig",
    "discount_app.apps.DiscountAppConfig",
    "third_api_app.apps.ThirdApiAppConfig",
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "backup_gs_66",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "localhost",
        "PORT": 5434,
        "CONN_MAX_AGE": 150
    }
}


ROOT_URLCONF = 'core.urls'

# WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Tehran'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'account_app.User'

# swagger settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'dev shop tools',
    'DESCRIPTION': 'dev API description shop tools',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
}

# Define a constant in settings.py to specify file upload permissions
CKEDITOR_5_FILE_UPLOAD_PERMISSION = "staff"  # Possible values: "staff", "authenticated", "any"

# drf framework settings
REST_FRAMEWORK = {
    # YOUR SETTINGS
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1'],
    "EXCEPTION_HANDLER": "rest_framework.views.exception_handler",
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/minute',  # 100 درخواست در دقیقه برای کاربران ناشناس
        'user': '200/minute',  # 200 درخواست در دقیقه برای کاربران عادی
    }
}

# config JWT settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    # "ROTATE_REFRESH_TOKENS": True,
    # "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "SIGNING_KEY": "salam_donya",
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    # "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    # "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    # "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    # "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    # "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

# config cache
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://localhost:6381/5",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"

# config celery
CELERY_BROKER_URL="redis://localhost:6381/2"
CELERY_RESULT_BACKEND="redis://localhost:6381/3"
CELERY_ACCEPT_CONTENT=['json', "pickle"]
CELERY_TASK_SERIALIZER="json"
CELERY_RESULT_SERIALIZER="json"
CELERY_TIMEZONE=TIME_ZONE
CELERY_ENABLE_UTC=True
CELERY_WORKER_CONCURRENCY = os.cpu_count()
CELERY_TASK_ALWAYS_EAGER = False
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_WORKER_MAX_TASKS_PER_CHILD = 100

# celery beat config
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

CELERY_TASK_QUEUES = (
    Queue("notifications"),
    Queue("otp_sms"),
    Queue("ba_salam"),
    Queue("payment"),
    Queue("update_order"),
    Queue("backup_db")
)

# config base storage
STORAGES = {
    'default':
        {
            'BACKEND': 'django.core.files.storage.FileSystemStorage'
        },
    'staticfiles':
        {
            'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'
        }
}

# backup bucket config
# ARVAN_BUCKET_BACKUP_URL = config("https://backup-gs-tools.s3.ir-thr-at1.arvanstorage.ir", cast=str)
# ARVAN_BUCKET_ACCESS_KEY = config("ARVAN_BUCKET_ACCESS_KET", cast=str)
# ARVAN_BUCKET_ACCESS_SECRET_KEY = config("ARVAN_BUCKET_ACCESS_SECRET_KEY", cast=str)

INTERNAL_IPS = [
    # ...
    "127.0.0.1",
    # ...
]

CKEDITOR_5_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
