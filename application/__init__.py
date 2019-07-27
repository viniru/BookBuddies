from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import os

#This function will be called when we type the command 'flask run' from the terminal

#test_config can be used if we are using some different configuration during test, now
#we are hardcoding as you can see (for database that is)

def create_app(test_config=None,instance_relative_config=True):

    app = Flask(__name__)   # create flask application
    app.config.from_mapping(       #dev environment
        SECRET_KEY='dev'
    )

    app.config['MYSQL_HOST'] = 'remotemysql.com'
    app.config['MYSQL_USER'] = 'fhiZCqtsqe'
    app.config['MYSQL_PASSWORD'] = 'ff17M9rbwu'
    app.config['MYSQL_DB'] = 'fhiZCqtsqe'
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

    app.database = MySQL(app)       #we assign the mysql object to app.database here, we cannot create the object after any
                                    #request made, this will throw an error. We need to create in the beginning only

    try:                                #when instance_relative_config = True (look at the parameter)
        os.makedirs(app.instance_path)  #app.instance_path -> all the config details are stored. I dont know what config details
    except OSError:                     #if we are using a local db, it would be stored here.
        pass

    from . import db                #We initialize app related stuff here -> go to db file for more details
    db.init_app(app)                # we are basically calling the init_app() function from here by importing it

    from . import auth              # Here, auth contains some functions which can be classified as a view of specific type
    app.register_blueprint(auth.bp) # NOT MVC VIEW. Here, view is basically a set of related events that can happen
                                     #like, authentication can be one view and you can have other such views
                                     # here, view name is bp
                                     #We are telling flask that, the view bp belongs to this particular object 'app', and when we
                                     # do this, by default , all the functions that route using 'bp' get registered to this
                                     # particular object


    from . import view               # same as before. This is another view
    app.register_blueprint(view.vw)


    from . import user
    app.register_blueprint(user.ur)


    from . import genres             
    app.register_blueprint(genres.genre)

    return app

