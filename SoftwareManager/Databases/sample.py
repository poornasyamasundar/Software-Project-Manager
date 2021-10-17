from django.db import connection

#Sample program to get required rows from database
def getSampleData():
    cursor = connection.cursor()
    cursor.execute('''SELECT * FROM Persons''')
    rows = cursor.fetchall()
    return rows

"""
# this is yashwanth's function
def isUser(user_name):
    cursor = connection.cursor()
    cursor.execute("SELECT username FROM Users WHERE username = %s GROUP BY username",(user_name,))

    msg = cursor.fetchone()
    if not msg:
        return False
    return True

def isTrueCredentials(user_name, user_password):
    cursor = connection.cursor()
    query = "SELECT * FROM Users WHERE (username = %s AND pass = %s)"
    cursor.execute(query,(user_name,user_password,))
    #cursor.fetchall()
    msg = cursor.rowcount
    print(msg)
    if msg==0:
        return False
    return True
"""
