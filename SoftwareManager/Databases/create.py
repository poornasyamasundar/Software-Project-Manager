from django.db import connection

def isUser(user_name):
    cursor = connection.cursor()
    query = "SELECT username FROM Users WHERE EXISTS(SELECT username FROM Users WHERE username = %s)"
    cursor.execute(query,(user_name,))

    msg = cursor.fetchone()
    if not msg:
        return False
    return True

def isTrueCredentials(user_name, user_password):
    cursor = connection.cursor()
    query = "SELECT username FROM Users WHERE EXISTS(SELECT username,pass FROM Users WHERE username = %s AND pass = %s)"
    cursor.execute(query,(user_name,user_password,))

    msg = cursor.fetchone()
    if not msg:
        return False
    return True

def insertUser(user_name, user_password):
    if(isUser(user_name)):
        return False

    cursor = connection.cursor()
    query = "INSERT INTO Users (username, pass) VALUES (%s, %s)"
    cursor.execute(query,(user_name,user_password,))

    return True
