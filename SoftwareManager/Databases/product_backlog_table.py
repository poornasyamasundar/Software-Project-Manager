from django.db import connection

def create_taskTable(table_name):
    cursor = connection.cursor()
    query = f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY,type INT,parent VARCHAR(30), foldername VARCHAR(30), createdBy VARCHAR(100),taskHeading VARCHAR(100),taskDetails VARCHAR(500), dateposted VARCHAR(20),completed BOOLEAN)"
    cursor.execute(query)
    return True


def allTasks(table_name):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name}"
    cursor.execute(query)

    result = cursor.fetchall()
    keys = ("id","type","parent", "foldername", "createdBy", "taskHeading", "taskDetails", "dateposted", "completed")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst

def insert(table_name,type,parent, foldername, createdBy, taskHeading, taskDetails, dateposted, completed):
    cursor = connection.cursor()
    query = f"INSERT INTO {table_name} (type, parent,foldername, createdBy, taskHeading, taskDetails, dateposted, completed) VALUES('{type}','{parent}','{foldername}','{createdBy}', '{taskHeading}', '{taskDetails}', '{dateposted}', {completed})"
    cursor.execute(query)

    return True

def delete(table_name, id):
    cursor = connection.cursor()
    query = f"DELETE FROM {table_name} WHERE id = {id}"
    cursor.execute(query)

    return True

def modifyTask(table_name,id,type,parent,foldername, createdBy, taskHeading, taskDetails, dateposted, completed):
    cursor = connection.cursor()
    query = f"UPDATE {table_name} SET type = '{type}',parent = '{parent}', foldername = '{foldername}', createdBy = '{createdBy}', taskHeading = '{taskHeading}', taskDetails = '{taskDetails}', dateposted = '{dateposted}', completed = {completed} WHERE id = '{id}'"
    #query = f"UPDATE {table_name} SET createdBy = %s, meetingLink = %s, createdOn = %s, purpose = %s WHERE id = %s"
    #cursor.execute(query, {createdBy, meetingLink, createdOn, purpose, id,})
    cursor.execute(query)

    return True

def getBacklogs(table_name, foldername):
    cursor = connection.cursor()

    query = f"SELECT * FROM {table_name} WHERE parent = '{foldername}'"
    print(query)
    cursor.execute(query)
    result = cursor.fetchall()
    keys = ("id","type","parent","foldername", "createdBy", "taskHeading", "taskDetails", "dateposted", "completed")
    lst = []


    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst
