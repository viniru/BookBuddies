import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash
from application.db import get_db
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
    response = {'Book':{}, 'Author':{}, 'Comments':[], 'GenreBooks':[]} #Initializing the response to be given by the endpoint
    #Comments and GenreBooks are Lists instead of dictionaries because there can be multiple comments and genres

    cur.execute('''SELECT title, rating, no_ratings, cover, description FROM Book WHERE b_id=%s''', b_id)
    vr = cur.fetchall()
    if vr:	#If tuple is not empty
    	vr = vr[0]
    book_q = 'title, rating, no_ratings, cover, description'.split(', ') #Seperating elements to individual items to map them to values
    for i in range(len(vr)):
    	response['Book'][book_q[i]] = vr[i]


    cur.execute('''SELECT a_id, name FROM Author WHERE b_id=%s''', b_id)
    vr = cur.fetchall()
    if vr:
    	vr = vr[0]
    author_q = 'a_id, name'.split(', ')
    for i in range(len(vr)):
    	response['Author'][author_q[i]] = vr[i]


    cur.execute('''SELECT c_id, title, likes, u_id FROM Comments WHERE b_id=%s''', b_id)
    vr = cur.fetchall()
    comment_q = 'c_id, title, likes, u_id'.split(', ')
    for c in range(len(vr)):	#Looping through multiple tuples as many comments can be returned from the query
    	response['Comments'].append({})  #Adding a dictionary for each comment
    	for i in range(len(vr[c])):
    		response['Comments'][c][comment_q[i]] = vr[c][i]


    cur.execute('''SELECT g_id, name FROM Genre WHERE g_id in (SELECT g_id FROM GenreBooks WHERE b_id=%s)''', b_id)
    vr = cur.fetchall()
    genre_q = 'g_id, name'.split(', ')
    for c in range(len(vr)):
    	response['GenreBooks'].append({})
    	for i in range(len(vr[c])):
    		response['GenreBooks'][c][genre_q[i]] = vr[c][i]


    return jsonify(response) #Return the response in json

