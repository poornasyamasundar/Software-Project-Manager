from django.db import connection

def createTable(table_name):
    cursor = connection.cursor()
    query = f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, createdBy VARCHAR(100), meetingLink VARCHAR(200), createdOn VARCHAR(20), purpose VARCHAR(500))"
    # cursor.execute(query, (table_name,))
    cursor.execute(query)
    return True

def specificMeetings(table_name, date):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name} WHERE createdOn = %s"
    cursor.execute(query, (date,))

    result = cursor.fetchall()
    keys = ("id", "createdBy", "meetingLink", "createdOn", "purpose")
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
    keys = ("id", "createdBy", "meetingLink", "createdOn", "purpose")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        print(dict)

    return lst

def insertMeeting(table_name, createdBy, meetingLink, createdOn, purpose):
    cursor = connection.cursor()
    query = f"INSERT INTO {table_name} (createdBy, meetingLink, createdOn, purpose) VALUES('{createdBy}', '{meetingLink}', '{createdOn}', '{purpose}')"
    cursor.execute(query)
    print('done')
    return True

def deleteMeetings(table_name, id):
    cursor = connection.cursor()
    query = f"DELETE FROM {table_name} WHERE id = {id}"
    cursor.execute(query)

    return True

def modifyMeeting(table_name, id, createdBy, meetingLink, createdOn, purpose):
    cursor = connection.cursor()
    query = f"UPDATE {table_name} SET createdBy = '{createdBy}', meetingLink = '{meetingLink}', createdOn = '{createdOn}', purpose = '{purpose}' WHERE id = '{id}'"
    #query = f"UPDATE {table_name} SET createdBy = %s, meetingLink = %s, createdOn = %s, purpose = %s WHERE id = %s"
    #cursor.execute(query, {createdBy, meetingLink, createdOn, purpose, id,})
    cursor.execute(query)

    return True
