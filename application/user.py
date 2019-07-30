import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt

ur = Blueprint('user', __name__, url_prefix='/user')

############################################## add book a user ######################################################
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
    db = get_db()
    cur = db.connection.cursor()

    # Querying the DB
    result = cur.execute('''SELECT b_id FROM BookList WHERE u_id = %s and b_id = %s''', (u_id, b_id))

    books = cur.fetchone()
    cur.close()            # Close connection..

    if books > 0:
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
@ur.route('/viewbooks', methods=['GET', 'POST'])
def viewbooks():
    # Getting details of user and status..
    u_id = request.json['u_id']
    status = request.json['status']

    return getbooks(u_id, status)


def getbooks(u_id, status):
    db = get_db()
    cur = db.connection.cursor()

    # Query..
    
    result = cur.execute('''SELECT b_id FROM BookList WHERE u_id = %s and status = %s''', (u_id, status))
    books = cur.fetchall()
    if result > 0:
        return jsonify(books)
    else:
        return 'No Books'

#######################################################################################################################

########################################### remove book from a user ###################################################
@ur.route('/removebook', methods=['POST'])
def removebook():
    # Getting details of the book to be removed.
    u_id = request.json['u_id']
    b_id = request.json['b_id']
    status = request.json['status']

    return remove_book_from_user(u_id, b_id, status)

def remove_book_from_user(u_id, b_id, status):
    db = get_db()
    cur = db.connection.cursor()

    # Querying...
    cur.execute('''DELETE FROM BookList WHERE u_id = %s and b_id = %s and status = %s''', (u_id, b_id, status))
    db.connection.commit()
    cur.close()

    return 'Removed'
