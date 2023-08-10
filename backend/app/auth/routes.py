from flask import request, jsonify
from app.auth import bp
from app.models.auth import Profile
from app.extensions import db

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_bcrypt import Bcrypt
from flask import current_app

@bp.route('/signup', methods=['POST'])
def signup():
    '''
        Creates account for user and store in database if all information is correct/unique

        Requests:
            payload (JSON): {
                Profile: {
                    'email' (str): The email of the user
                    'username' (str): The username of the user
                    'password' (str): The password of the user
                }
            }

            Response:
                (201): Account successfully created
                (204): All fields must be filled in
                (400): This username already exists

    '''
    inputs = request.get_json()
    if not inputs or not inputs.get('username') or not inputs.get('password'):
        return { 'message' : 'Could not Verify' }, 401
    user = Profile.query.filter_by(username=inputs['username']).first()
    if user:
        return { 'message' : 'Username already exist. Please select another.'}, 406
    
    newProfile = Profile(email = inputs['email'], username = inputs['username'], password = inputs['password'])
    db.session.add(newProfile)
    db.session.commit()
    return {'message': 'new profile created'}, 201

@bp.route('/login', methods=['POST'])
def login():
    '''
        The login route for all current users on the system

        Requests:
            payload (JSON): {
                'username' (str): The username of the user
                'password' (str): The password of the user
            }
        
        Response:
            (200): User's authenticated
                returns {
                    'access-token' (str): The access token used by user to call additional API
                } 
            (400): User's name or password did not match
            (404): User not found
    
    '''
    inputs = request.get_json()
    user = Profile.query.filter_by(username = inputs['username']).first()
    if not user:
        return {'message':'User not found'}, 404
    # check encrypted password
    print(user.password, inputs['password'])
    bcrypt = Bcrypt(current_app)
    if bcrypt.check_password_hash(user.password, inputs['password']) :
        #TODO: make expires_delta not forever
        access_token = create_access_token(identity=user.id,expires_delta=False)
        return { "access_token": access_token}, 200
    else :
        return {'message': "User's name or password did not match" }, 400

@bp.route('/<username>', methods=['GET'])
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

@bp.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():
    profile = Profile.query.filter_by(id = get_jwt_identity()).first()
    if not profile:
        return {'message' : 'User not found.'}, 400
    return profile.to_dict(), 200

@bp.route('/follow/<username>', methods=['POST'])
@jwt_required()
def follow(username):
    '''
        Add this profile to the list of followers

        Requests:
            payload (JSON):{
                
            }
        Response:
            (200) : Successfully followed Profile
    '''
    profile = Profile.query.filter_by(username = username).first()
    current_user = Profile.query.filter_by(id = get_jwt_identity()).first()
    if profile is None:
        return { 'message' : 'Profile not found'}, 400
    if profile == current_user:
        return { 'message' : 'You cannot follow yourself'}
    current_user.follow(profile)
    db.session.commit()
    return { 'message' : 'you are following ' + username }

@bp.route('/unfollow/<username>', methods=['POST'])
@jwt_required()
def unfollow(username):
    profile = Profile.query.filter_by(username = username).first()
    current_user = Profile.query.filter_by(id = get_jwt_identity()).first()
    if profile is None:
        return { 'message': 'Profile not found'}, 400
    if current_user.is_following(profile):
        current_user.unfollow(profile)
        db.session.commit()
        return { 'message': 'Successfully unfollow ' + username + '.'}, 200
    else:
        return { 'message': 'You are not following ' + username + ' cannot unfollow.'}, 401

@bp.route('/isfollowing/<username>', methods=['GET'])
@jwt_required()
def isfollowing(username):
    profile = Profile.query.filter_by(username = username).first()
    current_user = Profile.query.filter_by(id = get_jwt_identity()).first()
    if profile is None:
        return { 'message': 'Profile not found'}, 400
    else:
        if profile == current_user:
            return jsonify('self')
        return jsonify(current_user.is_following(profile))