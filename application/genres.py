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

    format_strings = ','.join(['%s'] * len(booklist))
    cur.execute("SELECT title, rating, no_ratings, cover FROM Book WHERE b_id in (%s)" % format_strings,
                tuple(booklist))

    vr = cur.fetchall()
    
    if vr:	
        book_q = 'title, rating, no_ratings, cover'.split(', ') 
        for i in range(len(vr)):
            result['details'].append({ 'Book':{},'Author':{} })
            for j in range(len(book_q)):
    	        result['details'][i]['Book'][book_q[j]] = vr[i][book_q[j]]

def selectAuthorDetails(result,booklist):
    cur = get_cursor()

    format_strings = ','.join(['%s'] * len(booklist))
    cur.execute("SELECT name FROM Author WHERE b_id in (%s)" % format_strings,
                tuple(booklist))

    vr = cur.fetchall()
    if vr:
        for i in range(len(vr)):
            result['details'][i]['Author']['name'] = vr[i]['name']

def getBookIdsGenre(g_id):
    cur = get_cursor()
    cur.execute('''select b_id from GenreBooks where g_id = {0}'''.format(g_id))        #get book ids of books beloning to a
    books = cur.fetchall()                                                              # particular genre
    booksList = []
    for b in books:
        booksList.append(b['b_id'])
    return booksList

def selectBooksJson(genre):
    g_id = get_genre_id(genre)
    booksList = getBookIdsGenre(g_id)
    result = {'details':[]}
    selectBookDetails(result,booksList)
    selectAuthorDetails(result,booksList)

    return jsonify(result)


def selectBooks(genre):
    result = {}     
    if genre in selectGenresDB():           #Check if this particular genre is present
        result = selectBooksJson(genre)
    else:
        result['status'] = 'Genre not present'  # if genre is not present in the database, return NOT FOUND
        result = jsonify(result)
    return result
#######################################################################################################

@genre.route('/add' , methods=['POST'])         #Controller
def addGenre():
    genre = request.json['genre']
    response = insertGenre(genre)
    return response
#######################################################################################################
@genre.route('/list', methods=['GET'])         #Controller
def listGenre():
    response = selectGenres()
    return response
#######################################################################################################
@genre.route('/getBooks', methods=['POST'])         #Controller
def getBooks():
    genre = request.json['genre']
    response = selectBooks(genre)
    return response

