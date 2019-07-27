import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt

friend = Blueprint('friend', __name__, url_prefix='/friends')


def usersExist(u_id_1, u_id_2):
	db = get_db()
	cur = db.connection.cursor()
	f1 = True
	f2 = True
	cur.execute('''SELECT * FROM User WHERE u_id = %s''', [u_id_1])
	if not cur.fetchall():
		f1 = False
	cur.execute('''SELECT * FROM User WHERE u_id = %s''', [u_id_2])
	if not cur.fetchall():
		f2 = False
	cur.close()
	return f1 and f2


def acceptrequestDB(u_id_1, u_id_2):
	db = get_db()
	cur = db.connection.cursor()
	cur.execute('''INSERT INTO Friends(u_id_1, u_id_2) VALUES(%s, %s)''',(u_id_1, u_id_2))
	db.connection.commit()
	cur.close()


def checkfriendsDB(u_id_1, u_id_2):
	db = get_db()
	cur = db.connection.cursor()
	cur.execute('''SELECT * FROM Friends WHERE ((u_id_1 = %s AND u_id_2 = %s) OR (u_id_2 = %s AND u_id_1 = %s))''', (u_id_1, u_id_2, u_id_2, u_id_1))
	if not cur.fetchall():
		return False
	cur.close()
	return True


@friend.route('/acceptrequest', methods=['POST'])
def acceptrequest():
	u_id_1 = request.json['u_id_1']
	u_id_2 = request.json['u_id_2']
	response = {}

	if not usersExist(u_id_1, u_id_2):
		response = {'response': 'One or both of the u_ids are invalid'}
		return jsonify(response)

	if not checkfriendsDB(u_id_1, u_id_2):
		acceptrequestDB(u_id_1, u_id_2)
		response['response'] = 'Sucess!'
	else:
		response['response'] = 'Already Friends!'

	return jsonify(response)



def unfriendDB(u_id_1, u_id_2):
	db = get_db()
	cur = db.connection.cursor()
	cur.execute('''DELETE FROM Friends WHERE ((u_id_1 = %s AND u_id_2 = %s) OR (u_id_2 = %s AND u_id_1 = %s))''',(u_id_1, u_id_2, u_id_2, u_id_1))
	db.connection.commit()


@friend.route('/unfriend', methods=['POST'])
def unfriend():
	u_id_1 = request.json['u_id_1']
	u_id_2 = request.json['u_id_2']
	response = {}

	if not usersExist(u_id_1, u_id_2):
		response = {'response': 'One or both of the u_ids are invalid'}
		return jsonify(response)

	if checkfriendsDB(u_id_1, u_id_2):
		unfriendDB(u_id_1, u_id_2)
		response['response'] = 'Sucess!'
	else:
		response['response'] = 'Not Friends in the first place!'

	return jsonify(response)

