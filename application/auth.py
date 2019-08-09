import functools
import json
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db, get_cursor
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt

bp = Blueprint('auth', __name__, url_prefix='/auth')        #we create a blueprint for a view here, named bp
#The url of any function  that uses bp will have prefix of '/auth/ in this case


######################################################### Register #####################################################################
# Registration form, rendered using HTML...
class RegisterForm(Form):
    name = StringField('Name', [validators.Length(min=3, max=50)])
    username = StringField('Username', [validators.Length(min=3, max=20)])
    email = StringField('Email', [validators.Length(min=6, max=30)])
    password = PasswordField('Password', [
        validators.Length(min=5, max=15),
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords do not match')
    ])
    confirm  = PasswordField('Confirm Password')

# Register
@bp.route('/register' , methods=['POST'])
def register():
    name = request.json['name']
    email = request.json['email']
    username = request.json['username']
    password = sha256_crypt.encrypt(str(request.json['password']))  # encrypt password

    response = {
        "success" : False,
        "email_exists" : False,
        "username_exists" : False
    }

    if email_exists(email):
        response["email_exists"] = True

    if username_exists(username):
        response["username_exists"] = True

    if response["username_exists"] or response["email_exists"]:
        return json.dumps(response)

    # email and username are unique.. Registering new user....
    if(add_User(name, email, username, password)):
        response['success'] = True

    return  json.dumps(response)


# return True if email already exists..
def email_exists(email):
    cur = get_cursor()
    # Querying
    result = cur.execute('''SELECT u_id from User WHERE email = %s''', [email])
    cur.close()

    if result > 0:
        return True
    else :
        return False

# returns True if username already exists
def username_exists(username):
    cur = get_cursor()
    # Querying
    result = cur.execute('''SELECT u_id from User WHERE username = %s''', [username])
    cur.close()

    if result > 0:
        return True
    else :
        return False

# Insert new user into the User table
def add_User(name, email, username, password):
    db = get_db()
    cur = db.connection.cursor()

    cur.execute('''INSERT INTO User(name, username, email, password) VALUES(%s, %s, %s, %s)''', (name, username, email, password))
    db.connection.commit()
    cur.close()

    return True

########################################################################################################################################


########################################################### Login ######################################################################
@bp.route('/login', methods = ['POST'])
def login():
    username = request.json['username']
    password_entered = request.json['password']
    data  = get_details(username)

    response = {
        "username_exists" : False,
        "password_matched" : False
    }

    if data is None:                    # No user exists
        return json.dumps(response);

    response["username_exists"] = True       # username does exist..

    password = data['password']
    u_id = data['u_id']

    if not sha256_crypt.verify(password_entered, password):     # compare passwords
        return json.dumps(response)                               # password didn't match

    response["password_matched"] = True                    # password matched...

    # User exists and Password Matched. logging in...
    initialize_session(username, u_id)
    print(response)
    return jsonify(response)

# get the details of the user...
def get_details(username):
    cur = get_cursor()
    # Querying
    result = cur.execute("SELECT u_id, password FROM User WHERE username = %s", [username])
    data = cur.fetchone()
    cur.close()

    return data        # contains u_id and encrypted password..

# initialize session for a user....
def initialize_session(username, u_id):
    session.clear()
    session['logged_in'] = True
    session['username'] = username
    session['u_id'] = u_id

########################################################################################################################################


########################################################## Logout ######################################################################
@bp.route('/logout')
def logout():
    session['logged_in'] = False
    session.clear()
    return 'You are now logged out'

########################################################################################################################################


######################################################### Account deletetion ###########################################################
@bp.route('/deleteaccount', methods=['POST'])
def delete():
    u_id = request.json['u_id']
    initialize_delete_user(u_id)

    return 'success'

# removes user from all the tables.
def initialize_delete_user(u_id):
    delete_user_book(u_id)
    delete_user_comment(u_id)
    delete_user_friend(u_id)
    delete_user_friendRequest(u_id)
    delete_user(u_id)

# Remove user from BookList table
def delete_user_book(u_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''DELETE FROM BookList WHERE u_id = %s''', [u_id])

    db.connection.commit()
    cur.close()

# Remove user from Comments table
def delete_user_comment(u_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''UPDATE Comments SET u_id = 23, title = NULL WHERE u_id = %s''', [u_id])

    db.connection.commit()
    cur.close()

# Remove user from FriendRequest table
def delete_user_friendRequest(u_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''DELETE FROM FriendRequest WHERE u_id_s = %s OR u_id_r = %s''', (u_id, u_id))

    db.connection.commit()
    cur.close()

# Remove user from Friends table
def delete_user_friend(u_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''DELETE FROM Friends WHERE u_id_1 = %s OR u_id_2 = %s''', (u_id, u_id))

    db.connection.commit()
    cur.close()

# Remove user from User table
def delete_user(u_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''DELETE FROM User WHERE u_id = %s''', [u_id])

    db.connection.commit()
    cur.close()

########################################################################################################################################
