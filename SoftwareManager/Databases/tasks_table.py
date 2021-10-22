from django.db import connection
import json

def create_taskTable(table_name):
    cursor = connection.cursor()
    query = f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, createdBy VARCHAR(100),taskHeading VARCHAR(100), taskDetails VARCHAR(500), createdOn VARCHAR(20), completed BOOLEAN, deadline VARCHAR(20))"
    cursor.execute(query)
    return True

def specificTasks(table_name, date):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name} WHERE deadline = %s"
    cursor.execute(query, (date,))

    result = cursor.fetchall()
    keys = ("id", "createdBy", "taskHeading", "taskDetails", "createdOn", "completed", "deadline")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst

def allTasks(table_name):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name}"
    cursor.execute(query)

    result = cursor.fetchall()
    keys = ("id", "createdBy", "taskHeading", "taskDetails", "createdOn", "completed", "deadline")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst

def insertTask(table_name, createdBy, taskHeading, taskDetails, createdOn, completed, deadline):
    cursor = connection.cursor()
    query = f"INSERT INTO {table_name} (createdBy, taskHeading, taskDetails, createdOn, completed, deadline) VALUES('{createdBy}', '{taskHeading}', '{taskDetails}', '{createdOn}', {completed}, '{deadline}')"
    cursor.execute(query)

    return True

def deleteTask(table_name, id):
    cursor = connection.cursor()
    query = f"DELETE FROM {table_name} WHERE id = {id}"
    cursor.execute(query)

    return True

def modifyTask(table_name, id, createdBy, taskHeading, taskDetails, createdOn, completed, deadline):
    cursor = connection.cursor()
    query = f"UPDATE {table_name} SET createdBy = '{createdBy}', taskHeading = '{taskHeading}', taskDetails = '{taskDetails}', createdOn = '{createdOn}', completed = {completed}, deadline = '{deadline}' WHERE id = '{id}'"
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
    keys = ("id", "createdBy", "taskHeading", "taskDetails", "createdOn", "completed", "deadline")
    lst = []


    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst
