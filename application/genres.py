import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify, json
)
from werkzeug.security import check_password_hash, generate_password_hash
from application.db import get_cursor
genre = Blueprint('genre', __name__, url_prefix='/genre')


def selectGenresDB():                 #Database operations
    cur = get_cursor()
    cur.execute('''SELECT name FROM Genre''')
    genres = cur.fetchall()
    return genres                       #return a list of genres

def selectGenres():
    genres = selectGenresDB() 
    genresJSON = {'genres':[]}         
    for g in genres:
        genresJSON['genres'].append(g[0])
    return jsonify(genresJSON)

def insertGenreDB(genre):             #Database operations
    cur = get_cursor()
    cur.execute('''insert into Genre(name) values(%s)''',[genre])
    

def insertGenre(genre):               #Model
    response = {'result':{}}
    genres_present = selectGenresDB()
    
    if genre not in genres_present:
        insertGenreDB(genre)
        response['result'] = 'success'
    else:
        response['result'] = 'Genre %s already present',genre

    return jsonify(response)



@genre.route('/add' , methods=['POST'])         #Controller
def addGenre():
    genre = request.json['genre']
    response = insertGenre(genre)
    return response

@genre.route('/list', methods=['GET'])         #Controller
def listGenre():
    response = selectGenres()
    return response