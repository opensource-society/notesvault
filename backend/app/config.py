import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    DEBUG = os.getenv("DEBUG", "True") == "True"
 