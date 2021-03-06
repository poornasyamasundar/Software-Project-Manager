from django.db import connection

def create_projecttable(table_name):
    cursor = connection.cursor()

    query = f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, createdBy VARCHAR(100) NOT NULL, createdOn VARCHAR(20), model VARCHAR(30) NOT NULL, projectName VARCHAR(60) NOT NULL, description VARCHAR(300), currentScrum int, currentSprint int, repolink varchar(200))"
    cursor.execute(query)
    return True

def insertProjectIntoTable(table_name, createdBy, createdOn, model, projectName, repolink, description, currentScrum, currentSprint):
    cursor = connection.cursor()
    query = f"INSERT INTO {table_name} (createdBy, createdOn, model, projectName, description, currentScrum, currentSprint, repolink) VALUES ('{createdBy}' , '{createdOn}', '{model}', '{projectName}', '{description}', '{currentScrum}', '{currentSprint}', '{repolink}')"

    cursor.execute(query)
    return True

def modifyProject(table_name,projectName, currentScrum, currentSprint, description):
    cursor = connection.cursor()
    if( description == '' ):
        query = f"UPDATE {table_name} SET currentScrum = '{currentScrum}', currentSprint = '{currentSprint}' WHERE projectName = '{projectName}'"
    else:
        query = f"UPDATE {table_name} SET description = '{description}' WHERE projectName = '{projectName}'"

    print(query)
    cursor.execute(query)
    return True

def allProjects(table_name):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name}"
    cursor.execute(query)

    result = cursor.fetchall()
    keys = ("id", "createdBy", "createdOn", "model", "projectName", "description", 'currentScrum', 'currentSprint', 'repolink')
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst

def specificProjects(table_name, model):
    cursor = connection.cursor()
    query = f"SELECT * FROM {table_name} WHERE model = '{model}'"
    cursor.execute(query)

    result = cursor.fetchall()
    keys = ("id", "createdBy", "createdOn", "model", "projectName", "description")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst

def deleteProject(table_name, id):
    cursor = connection.cursor()
    query = f"DELETE FROM {table_name} WHERE id = {id}"
    cursor.execute(query)
    return True
