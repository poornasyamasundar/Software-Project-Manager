from django.db import connection

def create_taskTable(table_name):
    cursor = connection.cursor()
    query = f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY,type INT,foldername VARCHAR(30), createdBy VARCHAR(100),taskHeading VARCHAR(100),taskDetails VARCHAR(500), dateposted VARCHAR(20),completed BOOLEAN)"
    cursor.execute(query)
    return True


def allTasks(table_name):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name}"
    cursor.execute(query)

    result = cursor.fetchall()
    keys = ("id","type","foldername", "createdBy", "taskHeading", "taskDetails", "dateposted", "completed")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst

def insert(table_name,type,foldername, createdBy, taskHeading, taskDetails, dateposted, completed):
    cursor = connection.cursor()
    query = f"INSERT INTO {table_name} (type,foldername, createdBy, taskHeading, taskDetails, dateposted, completed) VALUES('{type}','{foldername}','{createdBy}', '{taskHeading}', '{taskDetails}', '{dateposted}', {completed})"
    cursor.execute(query)

    return True

def delete(table_name, id):
    cursor = connection.cursor()
    query = f"DELETE FROM {table_name} WHERE id = {id}"
    cursor.execute(query)

    return True

def modifyTask(table_name,id,type,foldername, createdBy, taskHeading, taskDetails, dateposted, completed):
    cursor = connection.cursor()
    query = f"UPDATE {table_name} SET type = '{type}',foldername = '{foldername}', createdBy = '{createdBy}', taskHeading = '{taskHeading}', taskDetails = '{taskDetails}', dateposted = '{dateposted}', completed = {completed} WHERE id = '{id}'"
    #query = f"UPDATE {table_name} SET createdBy = %s, meetingLink = %s, createdOn = %s, purpose = %s WHERE id = %s"
    #cursor.execute(query, {createdBy, meetingLink, createdOn, purpose, id,})
    cursor.execute(query)

    return True

def getTasks(table_name, number, type):
    cursor = connection.cursor()

    if(type==0):
        query = f"SELECT * FROM (SELECT * FROM {table_name} ORDER BY id DESC) AS alias WHERE completed = 0 LIMIT {number}"
    else:
        query = f"SELECT * FROM (SELECT * FROM {table_name} ORDER BY id DESC) AS alias LIMIT {number}"
    #query = f"SELECT * FROM (SELECT * FROM {table_name} ORDER BY id DESC) AS alias LIMIT {number}"
    cursor.execute(query)
    result = cursor.fetchall()
    keys = ("id","type","foldername", "createdBy", "taskHeading", "taskDetails", "dateposted", "completed")
    lst = []


    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst
