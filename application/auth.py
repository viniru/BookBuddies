import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt

bp = Blueprint('auth', __name__, url_prefix='/auth')        #we create a blueprint for a view here, named bp
#The url of any function  that uses bp will have prefix of '/auth/ in this case


# Registration form, rendered using HTML...
class RegisterForm(Form):
    name = StringField('Name', [validators.Length(min=3, max=50)])
    username = StringField('Username', [validators.Length(min=3, max=20)])
    email = StringField('Email', [validators.Length(min=6, max=30)])
    password = PasswordField('Password', [
        validators.Length(min=5, max=15),
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords do not match')
    ])
    confirm  = PasswordField('Confirm Password')


# Register
@bp.route('/register' , methods=['GET','POST'])
def register():
    form = RegisterForm(request.form)
    if request.method == 'POST' and form.validate():
        # Getting data from wtform if...
        name = form.name.data
        email = form.email.data
        username = form.username.data
        password = sha256_crypt.encrypt(str(form.password.data))  # Password encrypted...

        # Access DB
        db = get_db()
        cur = db.connection.cursor()
        # Query
        cur.execute("INSERT INTO  User(name, username, email, password) VALUES(%s, %s, %s, %s)", (name, username, email, password))
        # Commit to DB
        db.connection.commit()
        # Close connection
        cur.close()
        return 'Success'

    return render_template('register.html', form=form)


# Login
@bp.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get fields
        username = request.form['username']
        password_entered = request.form['password']

        # Access DB
        db = get_db()
        cur = db.connection.cursor()

        # Query
        result = cur.execute("SELECT * FROM User WHERE username = %s", [username])
        data = cur.fetchone()
        password = data['password']

        # Close connection
        cur.close()

        if result == 0:              # Check if some user exsits
            return 'No user found'

        elif not sha256_crypt.verify(password_entered, password):    # Compare Passwords
            return 'Wrong Password'

        return 'You are Logged in'      # If user exsits and passwords match.

    return render_template('login.html')
