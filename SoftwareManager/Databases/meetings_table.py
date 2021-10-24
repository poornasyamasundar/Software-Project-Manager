from django.db import connection

def createTable(table_name):
    cursor = connection.cursor()
    query = f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, createdBy VARCHAR(100), meetingLink VARCHAR(200), createdOn VARCHAR(20), meetingDate INT, meetingTime VARCHAR(30), purpose VARCHAR(500))"
    cursor.execute(query)
    return True

def getLatestMeetings(table_name, number):
    if( number == -1 ):
        return allMeetings(table_name)
    cursor = connection.cursor()
    query = f"SELECT * FROM (SELECT * FROM {table_name} ORDER BY meetingDate DESC) AS alias LIMIT {number}"
    cursor.execute(query)
    result = cursor.fetchall()
    keys = ("id", "createdBy", "meetingLink", "createdOn", "meetingDate", 'meetingTime', "purpose")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        print(dict)

    return lst

def specificMeetings(table_name, date):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name} WHERE meetingDate = %s"
    cursor.execute(query, (date,))

    result = cursor.fetchall()
    keys = ("id", "createdBy", "meetingLink", "createdOn", 'meetingDate', 'meetingTime', "purpose")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        print(dict)

    return lst

def allMeetings(table_name):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name}"
    cursor.execute(query)

    result = cursor.fetchall()
    keys = ("id", "createdBy", "meetingLink", "createdOn", 'meetingDate', 'meetingTime', "purpose")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        print(dict)

    return lst

def insertMeeting(table_name, createdBy, meetingLink, createdOn, meetingDate, meetingTime, purpose):
    cursor = connection.cursor()
    query = f"INSERT INTO {table_name} (createdBy, meetingLink, createdOn, meetingDate, meetingTime, purpose) VALUES('{createdBy}', '{meetingLink}', '{createdOn}', '{meetingDate}', '{meetingTime}', '{purpose}')"
    cursor.execute(query)
    print('done')
    return True

def deleteMeetings(table_name, id):
    cursor = connection.cursor()
    query = f"DELETE FROM {table_name} WHERE id = {id}"
    cursor.execute(query)

    return True

def modifyMeeting(table_name, id, createdBy, meetingLink, createdOn, meetingDate, meetingTime, purpose):
    cursor = connection.cursor()
    query = f"UPDATE {table_name} SET createdBy = '{createdBy}', meetingLink = '{meetingLink}', createdOn = '{createdOn}', meetingDate = '{meetingDate}', meetingTime = '{meetingTime}', purpose = '{purpose}' WHERE id = '{id}'"
    #query = f"UPDATE {table_name} SET createdBy = %s, meetingLink = %s, createdOn = %s, purpose = %s WHERE id = %s"
    #cursor.execute(query, {createdBy, meetingLink, createdOn, purpose, id,})
    cursor.execute(query)

    return True
