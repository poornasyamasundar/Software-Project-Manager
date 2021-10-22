from django.db import connection

def create_noticeTable(table_name):
    cursor = connection.cursor()
    query = f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, createdBy VARCHAR(100), createdOn VARCHAR(20), description VARCHAR(500))"
    cursor.execute(query)
    return True

def insertNotice(table_name, createdBy, createdOn, description):
    cursor = connection.cursor()
    query = f"INSERT INTO {table_name} (createdBy, createdOn, description) VALUES('{createdBy}', '{createdOn}', '{description}')"
    cursor.execute(query)

    return True

def deleteNotice(table_name, id):
    cursor = connection.cursor()
    query = f"DELETE FROM {table_name} WHERE id = {id}"
    cursor.execute(query)

    return True

def modifyNotice(table_name, id, createdBy, createdOn, description):
    cursor = connection.cursor()
    query = f"UPDATE {table_name} SET createdBy = '{createdBy}', createdOn = '{createdOn}', description = '{description}' WHERE id = '{id}'"
    #query = f"UPDATE {table_name} SET createdBy = %s, meetingLink = %s, createdOn = %s, purpose = %s WHERE id = %s"
    #cursor.execute(query, {createdBy, meetingLink, createdOn, purpose, id,})
    cursor.execute(query)

    return True

def specificNotices(table_name, person):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name} WHERE createdBy = %s"
    cursor.execute(query, (person,))

    result = cursor.fetchall()
    keys = ("id", "createdBy", "createdOn", "description")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst

def getNotices(table_name, number):
    cursor = connection.cursor()

    query = f"SELECT * FROM (SELECT * FROM {table_name} ORDER BY id DESC) AS alias LIMIT {number}"

    cursor.execute(query)
    result = cursor.fetchall()
    keys = ("id", "createdBy", "createdOn", "description")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst
