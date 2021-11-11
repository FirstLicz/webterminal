"""
Django settings for WebTerminal project.

Generated by 'django-admin startproject' using Django 3.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
import os
import sys

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# 设置环境路径
sys.path.append(BASE_DIR)

# build binary file
GDAL_LIBRARY_PATH = r'C:\OSGeo4W64\bin'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-0e5=gnb!v2me8gfmx4ftgvodh2q=^5__m$7+o-cxr+4g=^q^%6'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',
    'chat',
    'terminal',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'WebTerminal.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [Path(BASE_DIR, "templates").as_posix()],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'WebTerminal.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'TEST': {   # test database config
            'NAME': BASE_DIR / 'db_test.sqlite3',
        }
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# media 媒体文件管理
MEDIA_URL = '/media/'
MEDIA_ROOT = Path(BASE_DIR, "media").as_posix()
if not os.path.isdir(MEDIA_ROOT):
    os.makedirs(MEDIA_ROOT, exist_ok=True)

# static root 目录，用于生产 nginx 代理
if DEBUG:
    STATICFILES_DIRS = [
        ("css", Path(BASE_DIR, "static", "css").as_posix()),
        ("img", Path(BASE_DIR, "static", "img").as_posix()),
        ("js", Path(BASE_DIR, "static", "js").as_posix()),
        ("plugins", Path(BASE_DIR, "static", "plugins").as_posix()),
    ]
else:
    STATIC_ROOT = Path(BASE_DIR, "static").as_posix()

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Channels
ASGI_APPLICATION = "WebTerminal.asgi.application"

REDIS_HOST = '192.168.6.191'
REDIS_PORT = 6379

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [(REDIS_HOST, REDIS_PORT)],
        },
    },
}

# LOGGING CONFIG
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname}-{asctime}-{module}-{process:d}-{lineno:d}:{message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname}:{message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
        },
        'ssh_consumer': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',   # 'logging.FileHandler',
            'formatter': 'verbose',
            # 'filename': os.path.join(BASE_DIR, 'log', 'sshconsumer.log'),
            # 'encoding': 'utf-8',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        # 'django': {
        #     'handlers': ['console'],
        #     'level': "DEBUG",
        #     'propagate': False,
        # },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
        'default': {
            'handlers': ['console'],
            'level': "DEBUG",
            'propagate': False,
        },
        'test': {
            'handlers': ['console'],
            'level': "DEBUG",
            'propagate': False,
        },
    },
}

# 缓存配置
CACHES = {
    # "default": {
    #     "BACKEND": "django_redis.cache.RedisCache",
    #     "LOCATION": "redis://127.0.0.1:6379/1",
    #     "OPTIONS": {
    #         "CONNECTION_POOL_KWARGS": {"max_connections": 20},
    #         "PASSWORD": "password"
    #     }
    # }
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': Path(BASE_DIR, 'django_cache').as_posix(),
        'TIMEOUT': None,
        'OPTIONS': {
            'MAX_ENTRIES': 2000
        }
    }
}

# 全局变量控制 websocket 中线程对象
TERMINAL_SESSION_DICT = {}

# 浏览器 iframe
X_FRAME_OPTIONS = 'SAMEORIGIN'
