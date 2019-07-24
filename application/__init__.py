from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import os


def create_app(test_config=None,instance_relative_config=True):

    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    app.config['MYSQL_HOST'] = 'remotemysql.com'
    app.config['MYSQL_USER'] = 'fhiZCqtsqe'
    app.config['MYSQL_PASSWORD'] = 'ff17M9rbwu'
    app.config['MYSQL_DB'] = 'fhiZCqtsqe'
    app.database = MySQL(app)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import view
    app.register_blueprint(view.vw)

    return app

