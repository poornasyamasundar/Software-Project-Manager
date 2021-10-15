from django.db import connection

#Sample program to get required rows from database
def getSampleData():
    cursor = connection.cursor()
    cursor.execute('''SELECT * FROM Persons''')
    rows = cursor.fetchall()
    return rows


