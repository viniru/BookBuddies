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

#################################################################### ADD Book
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
