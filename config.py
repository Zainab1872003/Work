import os
from dotenv import load_dotenv
load_dotenv()


class Config:

    SECRET_KEY = os.environ.get('SECRET_KEY', 'a-fallback-secret-key')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'a-fallback-jwt-key')

    MONGODB_SETTINGS = {
        'host': os.environ.get('MONGODB_URI')
    }

    JWT_TOKEN_LOCATION = ['cookies']
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # Default: 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES', 604800))  # Default: 7 days

    IS_PRODUCTION = os.environ.get('FLASK_ENV') == 'production'

    JWT_COOKIE_SECURE = False

    JWT_COOKIE_SAMESITE = 'None' if IS_PRODUCTION else 'Lax'

    JWT_COOKIE_CSRF_PROTECT = False

    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 10 MB upload limit
