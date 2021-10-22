from django.db import connection

def insertFeedback(createdBy, createdOn, feedback, rating):
    cursor = connection.cursor()
    query = "INSERT INTO Feedbacks (createdBy, createdOn, feedback, rating) VALUES (%s, %s, %s, %s)"

    cursor.execute(query, (createdBy, createdOn, feedback, rating,))
    return True

def deleteFeedback(id):
    cursor = connection.cursor()
    query = "DELETE FROM Feedbacks WHERE id = %s"

    cursor.execute(query, (id,))
    return True

def modifyFeedback(id, createdBy, createdOn, feedback, rating):
    cursor = connection.cursor()
    query = "UPDATE Feedbacks SET createdBy = %s, createdOn = %s, feedback = %s, rating = %s WHERE id = %s"

    cursor.execute(query, (createdBy, createdOn, feedback, rating, id))
    return True

def allFeedback(createdBy):
    cursor = connection.cursor()
    query = f"SELECT * FROM Feedbacks WHERE createdBy = '{createdBy}'"
    cursor.execute(query)

    result = cursor.fetchall()
    keys = ("id", "createdBy", "createdOn", "feedback", "rating")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst

def getComments(number):
    cursor = connection.cursor()

    query = f"SELECT * FROM (SELECT * FROM Feedbacks ORDER BY id DESC) AS alias LIMIT {number}"

    cursor.execute(query)
    result = cursor.fetchall()
    keys = ("id", "createdBy", "createdOn", "feedback", "rating")
    lst = []

    for row in result:
        dict = {keys[i] : row[i] for i in range(len(keys))}
        lst.append(dict)
        #print(dict)

    return lst
