from django.db import connection
from Databases.create import isUser

def getDetails(user_name):
    cursor = connection.cursor()
    query = "SELECT * FROM UserDetails WHERE userName = %s"
    cursor.execute(query, (user_name,))

    details = cursor.fetchone()
    return details

def insertDetails(name_, user_name,phone, address_, mail):

    cursor = connection.cursor()
    query = "INSERT INTO UserDetails (name, userName, phoneNo, address, email) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, (name_, user_name, phone, address_, mail))

    return True

def updateDetails(old_userName, name_, user_name,phone, address_, mail):

    if isUser(user_name):
        return False

    cursor = connection.cursor()
    query = "UPDATE UserDetails SET name = %s, userName = %s, phoneNo = %s, address = %s, email = %s WHERE userName = %s"
    cursor.execute(query, (name_, user_name, phone, address_, mail, old_userName))

    return True
