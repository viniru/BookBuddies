import click
from flask import current_app, g        # current_app and g are special global pointers which are 
from flask.cli import with_appcontext   #assigned the value of the flask when it was created
from flask import Flask, jsonify, request #instead of passing on the app , we use these things. look at the bottom
from flask_mysqldb import MySQL
import os

    
def get_db():   
    if 'db' not in g:
        mysql = current_app.database
        g.db = mysql
    return g.db

def get_cursor():
    return get_db().connection.cursor()

def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        cur = db.connection.cursor()
        cur.close()
        db = None

def init_app(app):
    app.teardown_appcontext(close_db)  #tells Flask to call that function when cleaning up after returning the response.


#g is a special object that is unique for each request. It is used to store data that
#  might be accessed by multiple functions during the request. The connection is stored
#  and reused instead of creating a new connection if get_db is called a second time in 
# the same request.


#  current_app is another special object that points to the Flask application handling the request.
#  Since you used an application factory, there is no application object when writing the rest of
#  your code. get_db will be called when the application has been created and is handling a request,
#  so current_app can be used.