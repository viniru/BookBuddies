import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from application.db import get_db
vw = Blueprint('view', __name__, url_prefix='/view')

@vw.route('/display')
def display():
    db = get_db()
    cur = db.connection.cursor()
    cur.execute('''SELECT * FROM User''')
    vr = cur.fetchall()
    return str(vr)