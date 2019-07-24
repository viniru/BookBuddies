import click
from flask import current_app, g
from flask.cli import with_appcontext
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import os


def get_db():
    if 'db' not in g:
        mysql = current_app.database
        g.db = mysql
    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        cur = db.connection.cursor()
        cur.close()
        db = None

def init_app(app):
    app.teardown_appcontext(close_db)