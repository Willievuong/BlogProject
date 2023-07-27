from flask import request
from sqlalchemy import desc
from app.models.auth import Profile
from app.models.auth import followers
from app.models.blog import Post
from app.models.blog import Comment
from app.blog import bp
from app.extensions import db

from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

import datetime

@bp.route('/createpost', methods=['POST'])
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

@bp.route('/<post_id>/editpost', methods=['POST'])
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
@bp.route('/post/<post_id>', methods=['GET'])
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

@bp.route('/<username>/posts', methods=['GET'])
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

@bp.route('/allposts', methods=['GET'])
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

@bp.route('/<post_id>/createcomment', methods=['POST'])
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