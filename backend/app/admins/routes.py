from app.admins import bp
from app.models.auth import Profile
from app.extensions import db

from functools import wraps

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


def is_admin(func):
    @wraps(func)
    def helper(*args, **kwargs):
        profile = Profile.query.filter_by(id = get_jwt_identity()).first()
        print(profile.to_dict())
        if not profile or profile.admin == False:
            return { "message" : "no admin permissions."}, 403
        else:
            return func(*args,**kwargs)
    return helper

@bp.route('/delete/<username>', methods=['POST'])
@jwt_required()
@is_admin
def delete_user(username):
    profile = Profile.query.filter_by(username = username).first()
    if not profile:
        return {'message': 'User not found.'}, 400
    db.session.delete(profile)
    db.session.commit()

@bp.route('/<username>', methods=['GET'])
@jwt_required()
@is_admin
def get_user(username):
    '''
        This route returns user information
        Response:
            (200): Successfully return profile data of <username>
                returns {
                    User {
                        'id' (int): The id of the profile, 
                        'username' (string): The username of the profile
                        'email' (string): The email of the profile
                    }
                }

    '''
    profile = Profile.query.filter_by(username = username).first()
    if not profile:
        return {'message' : 'User not found.'}, 400
    return profile.to_dict(), 200

@bp.route('/set_admin/<username>', methods=['POST'])
@jwt_required()
@is_admin
def set_admin(username):
    profile = Profile.query.filter_by(username = username).first()
    profile.admin = True
    db.session.commit()
    return profile.to_dict(), 200

