from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies
import datetime
import os

db = SQLAlchemy()
app = Flask(__name__)
flask_env = os.getenv("flask_env")
if flask_env == "production":
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')
cors = CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
# configure the SQLite database, relative to the app instance folder
# app.config["SQLALCHEMY_DATABASE_URI"] = production_database_url
# initialize the app with the extension
db.init_app(app)
migrate = Migrate(app, db)

@app.route('/', methods=['GET', 'POST'])
# @jwt_required()
def hello_world():
    # current_user = get_jwt_identity()
    # print(current_user)
    return {'message': 'From one to America, how free are you tonight? Henry ;)'}, 200

@app.route('/signup', methods=['POST'])
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

@app.route('/login', methods=['POST'])
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
    if bcrypt.check_password_hash(user.password, inputs['password']) :
        #TODO: make expires_delta not forever
        access_token = create_access_token(identity=user.id,expires_delta=False)
        return { "access_token": access_token}, 200
    else :
        return {'message': "User's name or password did not match" }, 400

@app.route('/<username>', methods=['GET'])
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

@app.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():
    profile = Profile.query.filter_by(id = get_jwt_identity()).first()
    if not profile:
        return {'message' : 'User not found.'}, 400
    return profile.to_dict(), 200

@app.route('/createpost', methods=['POST'])
@jwt_required()
def create_post():
    '''
        This route creates new post for the user

        Requests:
            payload (JSON):
                Post: {
                    'subject' (str): The subject line of the blog post
                    'content' (str): The contents of the blog post
                }
        Response:
            (201): Blog post created
            (400): Not all content is filled
    '''
    #TODO: change profile_id when adding authentication
    inputs = request.get_json()
    post = Post(subject=inputs['subject'], content=inputs['content'], time=datetime.datetime.now(), profile_id = get_jwt_identity())
    
    db.session.add(post)
    db.session.commit()
    return post.to_dict() , 201

@app.route('/<post_id>/editpost', methods=['POST'])
@jwt_required()
def edit_post(post_id):
    '''
        This route edit post for the user

        Requests:
            payload (JSON):
                Post: {
                    'subject' (str): The subject line of the blog post
                    'content' (str): The contents of the blog post
                }
        Response:
            (201): Blog post created
            (400): Not all content is filled
    '''
    post = Post.query.filter_by(post_id=post_id).first()
    if post.profile_id != get_jwt_identity():
        return {"message": "User does not have access to edit this post"}, 400
    inputs = request.get_json()
    if inputs['subject']:
        post.subject = inputs['subject']
    if inputs['content']:
        post.content = inputs['content']
    pass

#TODO: make get_post for user instead of id
@app.route('/post/<post_id>', methods=['GET'])
@jwt_required()
def get_post(post_id):
    '''
        Retrieve the requested post based on post id

        Requests:
            payload (JSON):
        Response:
            (200): Returns the content of the requested Post
                Post: {
                    'subject' (str): The subject line of the blog post
                    'content' (str): The contents of the blog post
                    'time'    (date and time): The time of create of the blog post
                    'id' (int): The unique idenifier of the blog post
                    'profile_id' (str): The id of the owner of this post
                    'username' (str): The username of the owner of this post
                }
            (404): Post with post_id cannot be found
    '''
    post = Post.query.filter_by(id = post_id).first()
    if not post:
        return {'message': 'post not found'}
    return post.to_dict(), 200

@app.route('/<username>/posts', methods=['GET'])
def get_user_posts(username):
    '''
        Retrieve the requested post based on profile_id

        Requests:
            payload (JSON): {
                numberOfPost: (int): The number of posts to return
            }
        Response:
            (200): Returns the content of the requested Post
                [<Post>]: list of Posts
            (404): Post with post_id cannot be found
    '''
    user = Profile.query.filter_by(username = username).first()
    posts = Post.query.filter_by(profile_id = user.id).order_by(desc('id')).limit(5)
    post_list = []
    for post in posts:
        post_list.append(post.to_dict())
    return {'data': post_list} , 200

@app.route('/allposts', methods=['GET'])
@jwt_required()
def get_all_posts():
    '''
        Retrieve the requested all self and followed posts

        Requests:
            payload (JSON): {
                numberOfPost: (int): The number of posts to return
            }
        Response:
            (200): Returns the content of the requested Post
                [<Post>]: list of Posts
            (404): Post with post_id cannot be found
    '''
    user = Profile.query.filter_by(id = get_jwt_identity()).first()
    followed = Post.query.join(
        followers, (followers.c.followed_id == Post.profile_id)).filter(
        followers.c.follower_id == user.id).order_by(desc('id')).limit(5)
    own = Post.query.filter_by(profile_id = user.id).order_by(desc('id')).limit(5)
    allposts = followed.union(own).order_by(Post.time.desc()).limit(5)
    post_list = []
    for post in allposts:
        post_list.append(post.to_dict())
    return { 'data' : post_list}, 200

@app.route('/follow/<username>', methods=['POST'])
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
    return { 'message' : 'you are following ' + username}

@app.route('/unfollow/<username>', methods=['POST'])
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

@app.route('/isfollowing/<username>', methods=['GET'])
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

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('profile.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('profile.id'))
)

@app.route('/<post_id>/createcomment', methods=['POST'])
@jwt_required()
def createcomment(post_id):
    i = request.get_json()
    if not i or not i.get('content'):
        return {'message': 'Comment not found'}, 400
    comment = Comment(
        content=i['content'], 
        time=datetime.datetime.now(), 
        profile_id=get_jwt_identity(), 
        post_id=post_id
        )
    
    db.session.add(comment)
    db.session.commit()
    return comment.to_dict() , 201


class Profile(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String)
    password = db.Column(db.String)
    posts = db.relationship('Post', backref='Profile')
    followed = db.relationship('Profile', 
                               secondary = followers, 
                               primaryjoin=(followers.c.follower_id == id),
                               secondaryjoin=(followers.c.followed_id == id),
                               backref= db.backref('followers', lazy='dynamic'),
                               lazy='dynamic')
    def to_dict(self):
        return {'id': self.id, 'username': self.username, 'email': self.email}

    def __str__(self):
        return "User(id='%s') " % self.id

    def __init__(self, username, password, email):
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.email = email

    def is_following(self, profile):
        return self.followed.filter(followers.c.followed_id == profile.id).count() > 0

    def follow(self, profile):
        if not self.is_following(profile):
            self.followed.append(profile)
    
    def unfollow(self, profile):
        if self.is_following(profile):
            self.followed.remove(profile)

class Post(db.Model):

    subject = db.Column(db.String(100),nullable=False)
    content = db.Column(db.String, nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'))
    comments = db.relationship('Comment', backref='post', lazy=True)

    def to_dict(self):
        comments = Comment.query.filter_by(post_id = self.id)
        comments_list = []
        for comment in comments:
            comments_list.append(comment.to_dict())
        return {'subject' : self.subject,
                'content' : self.content,
                'time' : self.time,
                'id' : self.id,
                'profile_id' : self.profile_id,
                'username' : Profile.query.filter_by( id = self.profile_id).first().username,
                'comments' : comments_list}    

class Comment(db.Model):
    
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    content = db.Column(db.String, nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    # likes = db.Column(db.Ineger, db.ForeignKey('profile.id'), nullable=False)

    def to_dict(self):
        return {'id': self.id,
                'content': self.content,
                'time': self.time,
                'post_id': self.post_id,
                'profile_id': self.profile_id,
                'username': Profile.query.filter_by(id=self.profile_id).first().username
        }


class Blog:
    def __init__(self):
        self.users = {}
        pass
    def create_acc(self, User):
        pass
    def logout(self, username):
        pass
    def post_blog(self, Post):
        pass
    def delete_blog(self, post_id):
        pass


if __name__ == '__main__':
    app.config.from_object('config.DevelopmentConfig')
    app.run(debug=True, host="0.0.0.0",port=5001)