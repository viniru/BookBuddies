import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db,  get_cursor
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt

bk = Blueprint('book', __name__, url_prefix='/book')

@bk.route('/add')
def addbook():
    return 'Not yet implemented'







@bk.route('/addcomment', methods=['POST'])
def addcomment():
    u_id = request.json['u_id']
    b_id = request.json['b_id']
    title = request.json['title']
    update_Comments(u_id, b_id, title)
    return 'Success'





def update_Comments(u_id, b_id, title):
    db = get_db()
    cur = db.connection.cursor()
    # Querying...
    cur.execute('''INSERT INTO Comments(title, b_id, u_id) VALUES(%s, %s, %s)''', (title, b_id, u_id))
    db.connection.commit()
    cur.close()



@bk.route('/deletecomment', methods=['POST'])
def deletecomment():
    c_id = request.json['c_id']

    delete_comment_from_book(c_id)

    return 'Success'

def delete_comment_from_book(c_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying...
    cur.execute('''DELETE FROM Comments WHERE c_id = %s''', (c_id))

    db.connection.commit()
    cur.close()
