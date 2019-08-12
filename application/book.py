import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db,  get_cursor
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt
from application.friends import userExists

bk = Blueprint('book', __name__, url_prefix='/book')

#################################################################### Get Rating


def bookExists(b_id):
    cur = get_cursor()
    cur.execute('''SELECT COUNT(*) FROM Book WHERE b_id = {0}'''.format(b_id))
    #print(cur.fetchone()['COUNT(*)'])
    if cur.fetchone()['COUNT(*)'] is 0:
        return False
    return True

def getRatingOfBookDB(b_id):
    cur = get_cursor()
    cur.execute('''SELECT rating,no_ratings FROM Book where b_id = {0}'''.format(b_id))
    result = cur.fetchone()
    return result['rating'],result['no_ratings']

def getRating(b_id):
    if bookExists(b_id) is not True:
        return 'Book with the given id does not exist'
    else:
        rating = getRatingOfBookDB(b_id)[0]
    return str(round(rating,1))

@bk.route('/getrating',methods=['POST'])
def getBookRating():                        #This uses database to fetch current user rating, if you
    response = {}                           #already have the value, then you will need to change this
    b_id = request.json['b_id']             #function to make it more efficient
    response['response'] = getRating(b_id)
    return response

#################################################################### Update Rating

def getRatingOfUserForBookDB(u_id,b_id):
    cur = get_cursor()
    cur.execute('''SELECT rating FROM UserBookRating where u_id = {0} and b_id = {1}'''.format(u_id,b_id))
    result = cur.fetchall()
    if len(result) is 0:
        return False,0
    return True,result[0]['rating']

def updateRatingDB(b_id,u_id,userRatingNew):
    cur = get_cursor()
    bookRating,no_rating = getRatingOfBookDB(b_id)
    ratingSum = bookRating * no_rating
    flag, userRating = getRatingOfUserForBookDB(u_id,b_id)
    newRatingOfBook = 0
    if flag is True:

        if userRatingNew is 0:
            cur.execute('''DELETE FROM UserBookRating where u_id = {1} and b_id = {2}'''.format(userRatingNew,u_id,b_id))
            no_rating = no_rating - 1
            if no_rating is not 0:
                newRatingOfBook = str(round( (ratingSum - userRating )/no_rating, 1))
            else:
                newRatingOfBook = 0
        else:
            newRatingOfBook = str(round( (ratingSum - userRating + userRatingNew)/no_rating, 1))
            cur.execute('''UPDATE UserBookRating SET rating = {0} where u_id = {1} and b_id = {2}'''.format(userRatingNew,u_id,b_id))


    else:
        no_rating = no_rating + 1
        newRatingOfBook = str(round( ( (ratingSum+userRatingNew)/no_rating), 1))
        if userRatingNew  is not 0:
            cur.execute('''INSERT INTO UserBookRating(b_id,u_id,rating) VALUES({0},{1},{2})'''.format(b_id,u_id,userRatingNew))

    cur.execute('''Update Book SET rating = {0}, no_ratings = {1} where b_id = {2}'''.format(newRatingOfBook,no_rating,b_id))
    get_db().connection.commit()
    return newRatingOfBook


def updateRating(b_id,u_id,newRating):
    if(bookExists(b_id) and userExists(u_id)):
        updateRatingDB(b_id,u_id,newRating)
        return 'Rating Updated Successfully'
    else:
        return 'Either the Book or the User is Invalid'

@bk.route('/updaterating',methods=['POST'])
def updateBookRating():
    response = {}
    b_id = request.json['b_id']
    u_id = request.json['u_id']
    rating = int(request.json['rating'])
    response['response'] = updateRating(b_id,u_id,rating)
    return response

#################################################################### Get Book rating for a particular user
@bk.route('/getuserrating',methods=['POST'])
def getRatingOfUserForBook():
    response = {}
    u_id = request.json['u_id']
    b_id = request.json['b_id']
    response['response'] = getRatingOfUserForBookDB(u_id,b_id)[1]
    return response

######################################################################################################################


####################################################### Add Book ######################################################
@bk.route('/add', methods=['POST'])
def addbook():
    title = request.json['title']
    author = request.json['author']
    cover = request.json['cover']
    description = request.json['description']
    genres = request.json['genre']

    if book_exists(title):
        return 'book already exists'        # book already exists..

    add_to_Book(title, cover, description)
    b_id = get_b_id(title)

    for genre in genres:
        if not genre_exists(genre):
            print(add_genre(genre))
        g_id = get_g_id(genre)
        add_GenreBooks(b_id, g_id)

    if not author_exists(author):
        add_author(author)

    a_id = get_a_id(author)
    add_AuthorBooks(b_id, a_id)

    return 'Success'

# returns True if book already exists
def book_exists(title):
    cur = get_cursor()
    # Querying
    cur.execute('''SELECT * FROM Book WHERE title = %s''', [title])
    result = cur.fetchone()
    cur.close()
    if result is None:
        return False
    else:
        return True
    return True

# adds  a  new  book to  Book  Table
def add_to_Book(title, cover, description):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''INSERT INTO Book(title, cover, description) VALUES(%s, %s, %s)''' ,(title, cover, description))

    cur.connection.commit()
    cur.close()
    return True

# return the b_id of the book with the given title
def get_b_id(title):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''SELECT b_id FROM Book WHERE title = %s''', [title])
    data = cur.fetchone()
    cur.close()

    return data['b_id']

# return True if genre already exists
def genre_exists(genre_name):
    cur = get_cursor()
    # Querying
    cur.execute('''SELECT g_id FROM Genre WHERE name = %s''', [genre_name])
    result = cur.fetchone()
    cur.close()
    print(result)
    if result is None:
        return False
    else:
        return True

# adds the given genre to DB...
def add_genre(genre_name):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''INSERT INTO Genre(name) VALUES(%s)''', [genre_name])
    db.connection.commit()
    cur.close()
    return 'Success'

# returns the g_id if the given genre
def get_g_id(genre_name):
    cur = get_cursor()
    # Querying
    data = cur.execute('''SELECT g_id FROM Genre WHERE name = %s''', [genre_name])
    print(data)
    result = cur.fetchone()
    print(result)
    cur.close()
    return result['g_id']

# add book to GenreBooks table..
def add_GenreBooks(b_id, g_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''INSERT INTO GenreBooks(b_id, g_id) VALUES(%s, %s)''', (b_id, g_id))
    db.connection.commit()
    cur.close()

# return True if author already exists
def author_exists(author_name):
    cur = get_cursor()
    # Querying
    cur.execute('''SELECT a_id FROM Author WHERE name = %s''', [author_name])
    result = cur.fetchone()
    cur.close()
    if result is None:
        return False
    else:
        return True

# adds a new author to Author table
def add_author(author_name):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''INSERT INTO Author(name) VALUES(%s)''', [author_name])
    db.connection.commit()
    cur.close()

# return a_id of the given author...
def get_a_id(author_name):
    cur = get_cursor()
    # Querying
    cur.execute('''SELECT a_id FROM Author WHERE name = %s''', [author_name])
    result = cur.fetchone()
    cur.close()
    return result['a_id']

# adds the given book to authorBooks table..
def add_AuthorBooks(b_id, a_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying
    cur.execute('''INSERT INTO AuthorBooks(b_id, a_id) VALUES(%s, %s)''', (b_id, a_id))
    db.connection.commit()
    cur.close()

#######################################################################################################################


##################################################### add comment #####################################################
@bk.route('/addcomment', methods=['POST'])
def addcomment():
    u_id = request.json['u_id']
    b_id = request.json['b_id']
    title = request.json['title']
    add_to_Comments(u_id, b_id, title)
    return get_comments_on_book(b_id)

#adds comment to the Comments table
def add_to_Comments(u_id, b_id, title):
    db = get_db()
    cur = db.connection.cursor()
    # Querying...
    cur.execute('''INSERT INTO Comments(title, b_id, u_id) VALUES(%s, %s, %s)''', (title, b_id, u_id))
    db.connection.commit()
    cur.close()

# return list of comments on a particular book
def get_comments_on_book(b_id):
    cur = get_cursor()
    #Querying...
    cur.execute('''SELECT Comments.c_id, Comments.title, Comments.comment_date, User.username, Comments.c_id, Comments.u_id
        FROM Comments
        LEFT JOIN User
        ON Comments.u_id = User.u_id
        WHERE Comments.b_id = %s ''', [b_id])

    result = cur.fetchall()
    cur.close()
    return jsonify(result)

#######################################################################################################################


##################################################### delete comment ##################################################
@bk.route('/deletecomment', methods=['POST'])
def deletecomment():
    c_id = request.json['c_id']
    b_id = request.json['b_id']
    delete_from_Comment(c_id)

    return get_comments_on_book(b_id)

def delete_from_Comment(c_id):
    db = get_db()
    cur = db.connection.cursor()
    # Querying...
    cur.execute('''DELETE FROM Comments WHERE c_id = %s''', [c_id])      # removes from the Comments able
    #cur.execute('''UPDATE Comments SET title=NULL WHERE c_id = %s ''' , (c_id))       # sets content of comment to null.
    db.connection.commit()
    cur.close()

#########################################################################################################################


######################################################## get all books ##################################################
@bk.route('/getallbooks', methods=['GET', 'POST'])
def getallbooks():
    cur = get_cursor()
    #Querying...
    cur.execute('''SELECT b_id, title, rating FROM Book''')

    result = cur.fetchall()
    return jsonify(result)

#########################################################################################################################
