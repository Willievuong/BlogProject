from app.extensions import db
from flask_bcrypt import Bcrypt
from flask import current_app

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('profile.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('profile.id'))
)

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
        bcrypt = Bcrypt(current_app)
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