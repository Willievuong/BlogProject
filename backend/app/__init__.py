from flask import Flask
from app.extensions import db
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies

from flask import Blueprint


import datetime
import os

# configure the SQLite database, relative to the app instance folder
# app.config["SQLALCHEMY_DATABASE_URI"] = production_database_url
# initialize the app with the extension

def create_app():
    app = Flask(__name__)
    flask_env = os.getenv("flask_env")
    if flask_env == "production":
        app.config.from_object('config.ProductionConfig')
    else:
        app.config.from_object('config.DevelopmentConfig')
    cors = CORS(app)
    jwt = JWTManager(app)
    bcrypt = Bcrypt(app)

    db.init_app(app)  
    migrate = Migrate(app, db)

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from app.blog import bp as blog_bp
    app.register_blueprint(blog_bp)

    from app.admins import bp as admin_bp
    app.register_blueprint(admin_bp, url_prefix="/admins")
  
    return app