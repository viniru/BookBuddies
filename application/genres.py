import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify, json
)
from werkzeug.security import check_password_hash, generate_password_hash
from application.db import get_cursor,get_db
genre = Blueprint('genre', __name__, url_prefix='/genre')


def selectGenresDB():                 #Database operations
    cur = get_cursor()
    cur.execute('''SELECT name FROM Genre''')
    genres = cur.fetchall()
    genresSet = []
    for ele in genres:
        genresSet.append(ele['name'])
    return genresSet                       #return a list of genres

def selectGenresIdDB():                 #Database operations
    cur = get_cursor()
    cur.execute('''SELECT g_id FROM Genre''')
    genres = cur.fetchall()
    print(type(genres))
    genresSet = []
    for ele in genres:
        genresSet.append(ele['g_id'])
    return genresSet  
    

def selectGenres():                     # make a call to function that accesses database
    genres = selectGenresDB()
    genresJSON = {}
    genresJSON['genres'] = genres
    return genresJSON

def insertGenreDB(genre):             #Database operations
    cur = get_cursor()
    cur.execute('''insert into Genre(name) values(%s)''',[genre])
    get_db().connection.commit()


def insertGenre(genre):               #Model
    response = {}
    genres_present = selectGenresDB()

    if genre not in genres_present:
        insertGenreDB(genre)
        response['response'] = 'success'
    else:
        response['response'] = ('Genre {0} is already present'.format(genre))

    return jsonify(response)

def get_genre_id(genre):            #Get genre id given genre
    cur = get_cursor()
    cur.execute('''select g_id from Genre where STRCMP(name,'{0}') = 0'''.format(genre))
    g_id = cur.fetchall()
    if g_id :           # assuming a None is returned if the genre is not present
        return g_id[0]['g_id']
    return None


def get_Genre_By_Genre_Id(g_id):            #Get genre given genre id
    cur = get_cursor()
    cur.execute('''select name from Genre where g_id = {0}'''.format(g_id))
    genre = cur.fetchall()
    if genre :           # assuming a None is returned if the genre is not present
        return genre[0]['name']
    return None


def selectBookDetails(result,booklist):     #get book details for all the b_ids of a particular g_id
    cur = get_cursor()

    format_strings = ','.join(['%s'] * len(booklist))
    cur.execute("SELECT title, rating, no_ratings, cover FROM Book WHERE b_id in (%s)" % format_strings,
                tuple(booklist))

    vr = cur.fetchall()

    if vr:
        book_q = 'title, rating, no_ratings, cover'.split(', ')
        for i in range(len(vr)):
            result['response'].append({ 'Book':{},'Author':{} })
            for j in range(len(book_q)):
    	        result['response'][i]['Book'][book_q[j]] = vr[i][book_q[j]]

def selectAuthorDetails(result,booklist):   #get author details for all the b_ids of a particular g_id
    cur = get_cursor()

    format_strings = ','.join(['%s'] * len(booklist))
    cur.execute("SELECT name FROM Author WHERE b_id in (%s)" % format_strings,
                tuple(booklist))

    vr = cur.fetchall()
    if vr:
        for i in range(len(vr)):
            result['response'][i]['Author']['name'] = vr[i]['name']

def getBookIdsByGenreId(g_id):  #get a list of book ids with g_id = something
    cur = get_cursor()
    cur.execute('''select b_id from GenreBooks where g_id = {0}'''.format(g_id))        #get book ids of books beloning to a
    books = cur.fetchall()                                                              # particular genre
    booksList = []
    for b in books:
        booksList.append(b['b_id'])
    return booksList


def selectBooksByGenreIdJson(g_id):     #fetch and merge results
    booksList = getBookIdsByGenreId(g_id)
    reponse = {'response':[]}
    selectBookDetails(reponse,booksList)
    selectAuthorDetails(reponse,booksList)

    return jsonify(reponse)


def selectBooks(g_id):         #check if the particular genre is present or not , then proceed
    response = {}
    if g_id in selectGenresIdDB():           #Check if this particular genre is present
        response = selectBooksByGenreIdJson(g_id)
    else:
        response['response'] = 'Genre not present'  # if genre is not present in the database, return NOT FOUND
        reponse = jsonify(response)
    return response
#######################################################################################################

@genre.route('/add' , methods=['POST'])         #Controller
def addGenre():                             #add a particular genre to the database
    genre = request.json['genre']
    response = insertGenre(genre)
    return response
#######################################################################################################
@genre.route('/list', methods=['GET'])         #Controller
def listGenre():
    response = {}                           #list all the genres present
    response["response"] = selectGenresDB()
    return response

#######################################################################################################
@genre.route('/listgenreid', methods=['GET'])         #Controller
def listGenreId():  
    response = {}                         #list all the genres_id present
    response['response'] = selectGenresIdDB()
    return response    
#######################################################################################################
@genre.route('/getbooksbygenreid', methods=['POST'])         #Controller
def getBooksByGenreId():             # get a list of books with some details of a particular genre id
    g_id = int(request.json['g_id'])
    response = selectBooks(g_id)
    return response
#######################################################################################################
@genre.route('/getbooksbygenre', methods=['POST'])         #Controller
def getBooksByGenre():             # get a list of books with some details of a particular genre
    genre = request.json['genre']
    g_id  = get_genre_id(genre)
    response = selectBooks(g_id)
    return response
#######################################################################################################
@genre.route('/getbookidsbygenreid', methods=['POST'])         #Controller
def getBooksIdsByGenreId():
    response = {}             # get a list of books with some details of a particular genre
    g_id = request.json['g_id']
    response['response'] = getBookIdsByGenreId(g_id)
    return response
#######################################################################################################
@genre.route('/getbookidsbygenre', methods=['POST'])         #Controller
def getBooksIdsByGenre():             # get a list of books with some details of a particular genre
    response={}
    genre = request.json['genre']
    g_id  = get_genre_id(genre)
    response['response'] = getBookIdsByGenreId(g_id)
    return response

#######################################################################################################
@genre.route('/getgenreidbygenre', methods=['POST'])         #Controller
def getGenreIdByGenre(): 
    response = {}                       # get a list of books with some details of a particular genre
    genre = request.json['genre']
    response['response']  = get_genre_id(genre)
    return response
#######################################################################################################
@genre.route('/getgenrebygenreid', methods=['POST'])         #Controller
def getGenreByGenreId(): 
    response = {}                       # get a list of books with some details of a particular genre
    g_id = request.json['g_id']
    response['reponse']  = get_Genre_By_Genre_Id(g_id)
    return response
