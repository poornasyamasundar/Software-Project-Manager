from django.db import connection
from Databases.create import isUser

def getDetails(user_name):
    cursor = connection.cursor()
    query = "SELECT * FROM UserDetails WHERE userName = %s"
    cursor.execute(query, (user_name,))

    details = cursor.fetchone()
    return details

def insertDetails(token, user_name,phone, gitUserName, mail):

    cursor = connection.cursor()
    query = "INSERT INTO UserDetails (name, userName, phoneNo, gitUserName, email) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, (token, user_name, phone, gitUserName, mail))

    return True

def updateDetails(token, user_name, gitUsername, mail):

    cursor = connection.cursor()
    query = f"UPDATE UserDetails SET name = '{token}', gitUserName = '{gitUsername}', email = '{mail}' WHERE username = '{user_name}'"
    print(query)
    cursor.execute(query)

    return True
