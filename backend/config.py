import os

class Config(object):
    TESTING = False
    JWT_SECRET_KEY = "Kq06kyGTM5UrqLRsLokql1jCSXNvooOw"

class ProductionConfig(Config):
    #PUT YOUR PRODUCTION DATABASE URL HERE!
    SQLALCHEMY_DATABASE_URI = os.getenv("production_database_url", "YOUR PRODUCTION DATABASE ENVIRONMENT HERE")


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres@blog_project_db:5432/database"

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres@blog_project_db:5432/database"
