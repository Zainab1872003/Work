import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    MONGODB_SETTINGS = {
        'host': os.getenv("MONGODB_URI")
    }
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # seconds
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 10 MB upload limit
