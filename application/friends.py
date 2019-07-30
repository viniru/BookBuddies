import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from application.db import get_db,get_cursor
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt

friend = Blueprint('friend', __name__, url_prefix='/friends')

def userExists(u_id):
	cur = get_cursor()
	cur.execute('''select u_id from User where u_id  = {0}'''.format(u_id))
	if not cur.fetchall():
		return False
	return True

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
	cur.execute('''SELECT * FROM Friends WHERE ((u_id_1 = %s AND u_id_2 = %s) OR (u_id_2 = %s AND u_id_1 = %s))''', (u_id_1, u_id_2, u_id_1, u_id_2))
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
		if not FriendRequestExists(u_id_1, u_id_2):
			return jsonify({'response': 'Friend Request doesn\'t exist'})

		acceptrequestDB(u_id_1, u_id_2)
		removeFriendRequestDB(u_id_1, u_id_2)
		response['response'] = 'Sucess!'
	else:
		response['response'] = 'Already Friends!'

	return jsonify(response)



def unfriendDB(u_id_1, u_id_2):
	db = get_db()
	cur = db.connection.cursor()
	cur.execute('''DELETE FROM Friends WHERE ((u_id_1 = %s AND u_id_2 = %s) OR (u_id_2 = %s AND u_id_1 = %s))''',(u_id_1, u_id_2, u_id_1, u_id_2))
	db.connection.commit()


def removeFriendRequestDB(u_id_1, u_id_2):
	db = get_db()
	cur = db.connection.cursor()
	cur.execute('''DELETE FROM FriendRequest WHERE ((u_id_s = %s AND u_id_r = %s) OR (u_id_r = %s AND u_id_s = %s))''',(u_id_1, u_id_2, u_id_1, u_id_2))
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
########################################################################## VIEW FRIEND REQUESTS
def viewRequestDB(u_id):	
	cur = get_cursor()
	cur.execute('''select u_id,name from User where u_id in ( select u_id_s from FriendRequest where u_id_r = {0})'''.format(u_id))
	return cur.fetchall()

def viewRequestsCompute(u_id):
	if userExists(u_id) is not True:
		return 'User Does Not Exist'
	list = viewRequestDB(u_id)
	return list

@friend.route('/viewrequests',methods=['POST'])
def viewRequests():
	response = {}												
	u_id = request.json['u_id']								    
	response['response'] = viewRequestsCompute(u_id)
	return response
########################################################################## VIEW FRIENDS

def viewFriendsDB(u_id):	
	cur = get_cursor()
	cur.execute('''select u_id,name from User where u_id in ( select u_id_1 from Friends where u_id_2 = {0}
				   UNION select u_id_2 from Friends where u_id_1 = {0})'''.format(u_id))
	return cur.fetchall()

def viewFriendsCompute(u_id):
	if userExists(u_id) is not True:
		return 'User Does Not Exist'
	list = viewFriendsDB(u_id)
	return list

@friend.route('/viewfriends',methods=['POST'])
def viewFriends():
	response = {}												
	u_id = request.json['u_id']								    
	response['response'] = viewFriendsCompute(u_id)
	return response
########################################################################## Deny Request
def FriendRequestExists(u_id_1,u_id_2):
	cur = get_cursor()
	cur.execute('''SELECT * FROM FriendRequest WHERE ((u_id_s = %s AND u_id_r = %s) OR (u_id_s = %s AND u_id_r = %s))''', (u_id_1, u_id_2, u_id_2, u_id_1))
	if not cur.fetchall():
		return False
	cur.close()
	return True

def denyRequestDB(u_id1,u_id2):
	cur = get_cursor()
	if FriendRequestExists(u_id1,u_id2) is False:
		return "The friend request does not exist"
	cur.execute(''' delete from FriendRequest where u_id_s = {0} AND u_id_r = {1} '''.format(u_id1,u_id2))
	get_db().connection.commit()
	return "Friend Request Denied"

@friend.route('/denyrequest',methods=['POST'])
def denyRequest():
	response = {}												
	u_id_s = request.json['u_id_s']								
	u_id_r = request.json['u_id_r']
	response['response'] = denyRequestDB(u_id_s,u_id_r)
	return response
########################################################################## Send Request

def sendRequestDB(u_id_s,u_id_r):
	cur = get_cursor()
	if FriendRequestExists(u_id_1, u_id_2):
		return {'response':'Friend Request Already Sent'}
	cur.execute('''INSERT INTO FriendRequest(u_id_s,u_id_r) VALUES({0},{1})'''.format(u_id_s,u_id_r))
	get_db().connection.commit()
	return {'response':'Friend Request Sent'}


def validityOfRequest(u_id_s,u_id_r):
	response = {}
	if u_id_s == u_id_r:
		response['response'] =  "you cannot send friend request to yourself"
	elif usersExist(u_id_s,u_id_r) is not True:
		response['response'] = "One or more users dont exist"
	elif checkfriendsDB(u_id_s,u_id_r) is True:
		response['response'] = 'Already Friends'
	elif FriendRequestExists(u_id_s,u_id_r):
		response['response'] = "Already sent"
	else:
		response['response'] = sendRequestDB(u_id_s,u_id_r)	
	return response			

@friend.route('/sendrequest',methods=['POST'])
def sendRequest():
	u_id_s = request.json['u_id_s']			
	u_id_r = request.json['u_id_r']
	response = validityOfRequest(u_id_s,u_id_r)
	return response
	

