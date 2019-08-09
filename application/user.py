import functools
import json
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db, get_cursor
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt

ur = Blueprint('user', __name__, url_prefix='/user')


############################################ add a book for user #####################################################
@ur.route('/addbook', methods=['POST'])
def addbook():
    u_id = request.json['u_id']
    b_id = request.json['b_id']
    status = request.json['status']

    if book_exists_for_user(u_id, b_id) :     # If book exists for same user...
        return 'Already exists!!'
    else:
        add_book_for_user(u_id, b_id, status)
        return 'Success'                            # Successfull addition of book...

# Method to check if the book already exists for the user...
def book_exists_for_user(u_id, b_id):
    cur = get_cursor()
    # Querying the DB
    cur.execute('''SELECT b_id FROM BookList WHERE u_id = %s and b_id = %s''', (u_id, b_id))
    books = cur.fetchone()
    cur.close()             # Close connection..

    if books > 0:               # If book exists return True..
        return True
    else:
        return False

# Method to add a book for a user...
def add_book_for_user(u_id, b_id, status):
    db = get_db()
    cur = db.connection.cursor()

    # Query to add the book for user
    cur.execute('''INSERT INTO BookList(u_id, b_id, status) VALUES(%s, %s, %s) ''' , (u_id, b_id, status))
    # Commit to DB.
    db.connection.commit()
    cur.close()

######################################################################################################################


########################################### View books for a user ####################################################
@ur.route('/viewbooks', methods=['POST'])
def viewbooks():
    u_id = request.json['u_id']
    status = request.json['status']

    return getbooks(u_id, status)

# returns the books for a user with a particular status...
def getbooks(u_id, status):
    cur = get_cursor()

    # Querying..
    cur.execute('''SELECT Book.title
        FROM BookList
        LEFT JOIN Book
        ON Book.b_id = BookList.b_id
        WHERE u_id = %s AND status = %s ''', (u_id, status))
    # JOIN between Book and BookList gives the name of books for the user with a status...

    books = cur.fetchall()
    cur.close()

    return jsonify(books)

#######################################################################################################################


########################################### remove book from a user ###################################################
@ur.route('/removebook', methods=['POST'])
def removebook():
    u_id = request.json['u_id']
    # u_id = session.get('u_id')
    b_id = request.json['b_id']
    status = request.json['status']

    return remove_book_from_user(u_id, b_id, status)

# removes the book from user
def remove_book_from_user(u_id, b_id, status):
    db = get_db()
    cur = db.connection.cursor()

    # Querying...
    cur.execute('''DELETE FROM BookList WHERE u_id = %s and b_id = %s and status = %s''', (u_id, b_id, status))
    db.connection.commit()
    cur.close()

    return 'Removed'

#######################################################################################################################


################################################ change username ######################################################
@ur.route('/changeusername', methods=['POST'])
def changeusername():
    old_username = request.json['old_username']
    # u_id = session.get('u_id')     # old_username not required..
    new_username = request.json['new_username']

    update_username(old_username, new_username)

    return 'Success'

# updates the username
def update_username(old_username, new_username):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''UPDATE User SET username = %s WHERE username = %s''' , (new_username, old_username))

    db.connection.commit()
    cur.close()

#######################################################################################################################


################################################# change password #####################################################
@ur.route('/changepassword', methods=['POST'])
def changepassword():
    username = request.json['username']
    # u_id = session.get('u_id')     # username not required..
    old_password = request.json['old_password']
    new_password = sha256_crypt.encrypt(str(request.json['new_password']))

    if password_matches(username, old_password):
        update_password(username, new_password)
    else:
        return 'Wrong Password'
        # flash('password didnt match') and return form again..

    return 'Success'

# Compares the old and new password..returns True if matched..
def password_matches(username, old_password):
    cur = get_cursor()

    cur.execute('''SELECT password FROM User WHERE username = %s ''', [username])
    password = cur.fetchone()['password']
    cur.close()

    if sha256_crypt.verify(old_password, password):        # decrypt and compare.....
        return True

    return False

# updates the password for username.....
def update_password(username, new_password):
    db = get_db()
    cur = db.connection.cursor()

    cur.execute('''UPDATE User SET password = %s WHERE username = %s''' , (new_password, username))
    db.connection.commit()
    cur.close()

#######################################################################################################################
