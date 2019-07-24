import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash
from application.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')        #we create a blueprint for a view here, named bp
#The url of any function  that uses bp will have prefix of '/auth/ in this case
                                                            

@bp.route('/register', methods=['POST'])    

@bp.route('/register')    # url would be /auth/register , it is bp.route and not app.route, bp is registered to app
def register():
    db = get_db()           # gets the db connection that has already been made
    cur = db.connection.cursor()
    name = request.json["name"]
    password = request.json["password"]
    email = request.json["email"]
    cur.execute("INSERT INTO `User`(`name`, `password`, `email`) VALUES (%s, %s, %s)", (name, password, email))
    db.connection.commit()
    return "Success!"





	
