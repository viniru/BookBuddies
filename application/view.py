import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db
from passlib.hash import sha256_crypt

vw = Blueprint('view', __name__, url_prefix='/view')        #Read auth.py for details

@vw.route('/display')
def display():
    db = get_db()
    cur = db.connection.cursor()
    cur.execute('''SELECT * FROM User''')
    vr = cur.fetchall()
    return str(vr)

@vw.route('/book', methods=['POST'])
def book():
    b_id = request.json['b_id']
    db = get_db()
    cur = db.connection.cursor()
    response = {'Book':{}, 'Author':[], 'Comments':[], 'GenreBooks':[]} #Initializing the response to be given by the endpoint
    #Comments and GenreBooks are Lists instead of dictionaries because there can be multiple comments and genres

    cur.execute('''SELECT title, rating, no_ratings, cover, description FROM Book WHERE b_id=%s''', b_id)
    cur.execute('''SELECT title, rating, no_ratings,  description FROM Book WHERE b_id=%s''', b_id)
    vr = cur.fetchall()
    if vr:	#If tuple is not empty
        response['Book'] = vr[0]
    else:
        return {'response': 'Invalid Book id'}

    cur.execute('''SELECT a_id, name FROM Author WHERE b_id=%s''', b_id)
    cur.execute('''SELECT Author.a_id, name FROM Author inner join AuthorBooks on Author.a_id = AuthorBooks.a_id WHERE AuthorBooks.b_id=%s''',b_id)
    vr = cur.fetchall()
    response['Author'] = vr


    cur.execute('''SELECT c_id, title, likes, u_id FROM Comments WHERE b_id=%s''', b_id)
    vr = cur.fetchall()
    response['Comments'] = vr


    cur.execute('''SELECT g_id, name FROM Genre WHERE g_id in (SELECT g_id FROM GenreBooks WHERE b_id=%s)''', b_id)
    vr = cur.fetchall()
    response['GenreBooks'] = vr

    return jsonify(response) #Return the response in json
