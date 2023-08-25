from flask import Blueprint

bp = Blueprint('admins', __name__, cli_group='admins')

from app.admins import routes