from app.extensions import db
from app.models.auth import Profile

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