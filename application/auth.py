import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from application.db import get_db
bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register')    
def register():
    db = get_db()
    cur = db.connection.cursor()
    name = request.values["name"]
    password = request.values["password"]
    email = request.values["email"]
    cur.execute("INSERT INTO `User`(`name`, `password`, `email`) VALUES (%s, %s, %s)", (name, password, email))
    db.connection.commit()
    return " "





	
