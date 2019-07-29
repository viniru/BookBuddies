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

def getRatingDB(b_id):
    cur = get_cursor()
    cur.execute('''SELECT rating,no_ratings FROM Book where b_id = {0}'''.format(b_id))
    result = cur.fetchone()
    return result['rating'],result['no_ratings']

def getRating(b_id):
    if bookExists(b_id) is not True:
        return 'Book with the given id does not exist'
    else:
        rating = getRatingDB(b_id)[0]
    return str(round(rating,1))

@bk.route('/getrating',methods=['POST'])
def getBookRating():
    response = {}
    b_id = request.json['b_id']
    response['response'] = getRating(b_id)
    return response

#################################################################### Update Rating

def ratingPresent(u_id,b_id):
    cur = get_cursor()
    cur.execute('''SELECT rating FROM UserBookRating where u_id = {0} and b_id = {1}'''.format(u_id,b_id))
    result = cur.fetchall()
    if len(result) is 0:
        return False,0
    return True

def updateRatingDB(b_id,u_id,newRating):
    cur = get_cursor()
    rating,no_rating = getRatingDB(b_id)
    ratingSum = rating * no_rating
    flag = ratingPresent(u_id,b_id)
    
    if flag is True:
        if no_rating is not 0:
            value = str(round( ((ratingSum-rating+newRating)/no_rating) , 1))
        else:
            value = str(round( rating , 1))
        cur.execute('''UPDATE UserBookRating SET rating = {0} where u_id = {1} and b_id = {2}'''.format(newRating,u_id,b_id))
        
    else:
        value = str(round ( (rating+newRating)/(no_rating+1)),1)
        cur.execute('''INSERT INTO UserBookRating(b_id,u_id,rating) VALUES({0},{1},{2})'''.format(b_id,u_id,newRating))
        no_rating = no_rating + 1

    cur.execute('''Update Book SET rating = {2}, no_ratings = {1} where b_id = {0}'''.format(b_id,no_rating,newRating))
    get_db().connection.commit()
    return value


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
