from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from Databases.sample import getSampleData
from Databases.create import isUser, isTrueCredentials, insertUser
from Databases.creation import getDetails, insertDetails, updateDetails
from Databases.meetings_table import createTable, specificMeetings, allMeetings, deleteMeetings, modifyMeeting, insertMeeting
from Databases.tasks_table import create_taskTable, specificTasks, allTasks, deleteTask, modifyTask, insertTask
from Databases.feedback import insertFeedback, deleteFeedback, modifyFeedback, allFeedback
from Databases.projects_table import create_projecttable, insertProject, modifyProject, deleteProject, allProjects, specificProjects

def index(request):
    print("**********************************")
    print("Printed to terminal")
    #use the functions in databases to get the data

    lst = specificProjects('projects', "waterfall")
    print(lst)

    print("**********************************")
    return render(request, 'index.html')

# Create your views here.
def index_(request):
    print("**********************************")
    print("Printed to terminal")
    #use the functions in databases to get the data
    print(getSampleData())
    print("**********************************")
    return render(request, 'index.html')

#sample function to process a ajax GET request
def testGET(request):
    if request.method == 'GET':
        #get the values as specified in the javascript
        value = 'sample return value from the server'
        return HttpResponse(value)

def testPOST(request):
    if request.method == 'POST':
        value = request.POST['userinput']
        print(request.POST)
        return HttpResponse(value)
