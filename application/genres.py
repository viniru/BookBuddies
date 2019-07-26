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
    print(type(genres[0]))
    genresList = []
    for g in genres:
        genresList.append(g['name'])
    return genresList                       #return a list of genres

def selectGenres():
    genres = selectGenresDB() 
    genresJSON = {}
    genresJSON['genres'] = genres         
    return jsonify(genresJSON)

def insertGenreDB(genre):             #Database operations
    cur = get_cursor()
    cur.execute('''insert into Genre(name) values(%s)''',[genre])
    

def insertGenre(genre):               #Model
    response = {}
    genres_present = selectGenresDB()
    
    if genre not in genres_present:
        insertGenreDB(genre)
        response['result'] = 'success'
    else:
        response['result'] = ('Genre {0} is already present'.format(genre))

    return jsonify(response)

def get_genre_id(genre):
    cur = get_cursor()
    cur.execute('''select g_id from Genre where STRCMP(name,'{0}') = 0'''.format(genre))
    g_id = cur.fetchall()   
    if g_id :           # assuming a None is returned if the genre is not present
        return g_id[0]['g_id']           
    return None


def selectBookDetails(result,booklist):
    cur = get_cursor()
    cur.execute('''SELECT title, rating, no_ratings, cover FROM Book WHERE b_id in {0}'''.format(booklist))
    vr = cur.fetchall()
    if vr:	#If tuple is not empty
        book_q = 'title, rating, no_ratings, cover, description'.split(', ') #Seperating elements to individual items to map them to values
        for i in range(len(vr)):
            result['details'].append({ 'Book':{} })
            for j in range(len(book_q)):
    	        result[i]['Book'][book_q[i]] = vr[i][book_q[i]]




@genre.route('/add' , methods=['POST'])         #Controller
def addGenre():
    genre = request.json['genre']
    response = insertGenre(genre)
    return response

@genre.route('/list', methods=['GET'])         #Controller
def listGenre():
    response = selectGenres()
    return response

