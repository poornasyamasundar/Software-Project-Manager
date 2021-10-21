from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from Databases.sample import getSampleData
from Databases.create import isUser, isTrueCredentials, insertUser
from Databases.creation import getDetails, insertDetails, updateDetails
from Databases.meetings_table import createTable, specificMeetings, allMeetings, deleteMeetings, modifyMeeting, insertMeeting
from Databases.tasks_table import create_taskTable, specificTasks, allTasks, deleteTask, modifyTask, insertTask, getTasks
from Databases.feedback import insertFeedback, deleteFeedback, modifyFeedback, allFeedback
from Databases.projects_table import create_projecttable, insertProject, modifyProject, deleteProject, allProjects, specificProjects
import json
from django.views.decorators.csrf import csrf_exempt
import datetime

def index(request):
    print("**********************************")
    print("Printed to terminal")
    #use the functions in databases to get the data


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

@csrf_exempt
def to_getTasksPy(request):
    #print(request.method)
    #print(request.POST)
    if request.method == 'POST':
        table_name = request.POST['table_name']
        number = request.POST['number']
        type = request.POST['type_']
        result = getTasks(table_name, number , type)
        #print(result)
        return HttpResponse(json.dumps(result))

@csrf_exempt
def meetingFunctionPy(request):
    if request.method == 'POST':

        table_name = request.POST['table_name']
        type = request.POST['type_']
        id = request.POST['id']
        createdBy = request.POST['createdBy']
        meetingLink = request.POST['meetingLink']
        createdOn = request.POST['createdOn']
        purpose = request.POST['purpose']

        date = str(datetime.datetime.today())
        date = date[0:10]

        if type == '1':
            insertMeeting(table_name, createdBy, meetingLink, date, purpose)
        elif type == '2':
            modifyMeeting(table_name, id, createdBy, meetingLink, createdOn, purpose)
        elif type == '3':
            deleteMeetings(table_name, id)

        return HttpResponse("s")

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
