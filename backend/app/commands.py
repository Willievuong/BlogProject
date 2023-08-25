import click
from flask import Flask

from app.models.auth import Profile
from app.extensions import db
from app.auth import bp as auth_bp
from app.admins import bp as admins_bp
from flask import current_app as app
from flask.cli import with_appcontext

@app.cli.command('create_user')
@with_appcontext
def create_user():
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
    username = input("Enter Username: ")
    user = Profile.query.filter_by(username=username).first()
    if user:
        return { 'message' : 'Username already exist. Please select another.'}, 406
    password = input("Enter Password: ")
    email = input('Enter Email: ')
    newProfile = Profile(email = email, username = username, password = password)
    db.session.add(newProfile)
    db.session.commit()
    return {'message': 'new profile created'}, 201

@app.cli.command('delete_user')
def delete_user():
    username = input("Enter Username: ")
    profile = Profile.query.filter_by(username = username).first()
    profileName = profile.username
    if not profile:
        return {'message': 'User not found.'}, 404
    db.session.delete(profile)
    db.session.commit()
    return {'User ' + profileName + " has been deleted"}, 204

@app.cli.command('set_admin')
def set_admin():
    username = input("Enter Username: ")
    profile = Profile.query.filter_by(username = username).first()
    profile.admin = True
    db.session.commit()
    return profile.to_dict(), 200

@app.cli.command('remove_admin')
def remove_admin():
    username = input("Enter Username: ")
    profile = Profile.query.filter_by(username = username).first()
    if not profile:
        return { 'message': 'User not found.'}, 404
    profile.admin = False
    db.session.commit()
    return profile.to_dict(), 200

@app.cli.command('display_all_user')
def display_all_user():
    profiles = Profile.query.all()
    for profile in profiles:
        print(profile.to_dict())
