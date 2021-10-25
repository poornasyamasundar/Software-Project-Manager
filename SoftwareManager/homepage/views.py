from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from Databases.sample import getSampleData
from Databases.create import isUser, isTrueCredentialscorrect, insertUserIntoTable
from Databases.creation import getDetails, insertDetails, updateDetails
from Databases.meetings_table import createTable, specificMeetings, allMeetings, deleteMeetings, modifyMeeting, insertMeeting, getLatestMeetings
from Databases.tasks_table import create_taskTable, specificTasks, allTasks, deleteTask, modifyTask, insertTask, getTasks
from Databases.feedback import insertFeedback, deleteFeedback, modifyFeedback, allFeedback, getComments
from Databases.projects_table import create_projecttable, insertProjectIntoTable, modifyProject, deleteProject, allProjects, specificProjects
from Databases.notices_table import create_noticeTable, insertNotice, modifyNotice, deleteNotice, specificNotices, getNotices
import json
from django.views.decorators.csrf import csrf_exempt
import datetime

def index(request):
    return render(request, 'home.html')

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
    if request.method == 'POST':
        table_name = request.POST['table_name']
        number = request.POST['number']
        type_ = request.POST['type_']
        result = getTasks(table_name, number , type_)
        return HttpResponse(json.dumps(result))

@csrf_exempt
def to_getBacklogsPy(request):
    if request.method == 'POST':
        table_name = request.POST['table_name']
        foldername = request.POST['foldername']
        result = getBacklogs(table_name, foldername)
        return HttpResponse(json.dumps(result))

@csrf_exempt
def to_getMeetsPy(request):
    if request.method == 'POST':
        table_name = request.POST['table_name']
        number = request.POST['number']
        result = getLatestMeetings(table_name, number)
        return HttpResponse(json.dumps(result))

@csrf_exempt
def to_getNoticesPy(request):
    #print(request.method)
    #print(request.POST)
    if request.method == 'POST':
        table_name = request.POST['table_name']
        number = request.POST['number']
        result = getNotices(table_name, number)
        #print(result)
        return HttpResponse(json.dumps(result))

@csrf_exempt
def to_getCommentsPy(request):
    #print(request.method)
    #print(request.POST)
    if request.method == 'POST':
        number = request.POST['number']
        result = getComments(number)
        #print(result)
        print('comments')
        print(result)
        return HttpResponse(json.dumps(result))

@csrf_exempt
def meetingFunctionPy(request):
    if request.method == 'POST':
        print(request.POST)
        table_name = request.POST['table_name']
        type_ = request.POST['type_']
        i = request.POST['id']
        createdBy = request.POST['createdBy']
        meetingLink = request.POST['meetingLink']
        createdOn = request.POST['createdOn']
        meetingDate = request.POST['meetingDate']
        meetingTime = request.POST['meetingTime']
        purpose = request.POST['purpose']

        date = str(datetime.datetime.today())
        date = date[0:10]

        if type_ == '1':
            insertMeeting(table_name, createdBy, meetingLink, date, meetingDate, meetingTime, purpose)
        elif type_ == '2':
            modifyMeeting(table_name, i, createdBy, meetingLink, date, meetingDate, meetingTime, purpose)
        elif type_ == '3':
            deleteMeetings(table_name, i)

        return HttpResponse("s")
@csrf_exempt
def backlogFunctionPy(request):
    if request.method == 'POST':
        print(request.POST)
        table_name = request.POST['table_name']
        mode = request.POST['mode']
        id = request.POST['id']
        createdBy = request.POST['createdBy']
        dateposted = request.POST['dateposted']
        foldername = request.POST['foldername']
        par = request.POST['par']
        taskDetails = request.POST['taskDetails']
        taskHeading = request.POST['taskHeading']
        type = request.POST['type']

        date = str(datetime.datetime.today())
        date = date[0:10]

        if type == '1':
            insert(table_name, type, par, foldername, createdBy, taskHeading, taskDetails, date, 0)
        elif type == '2':
            modifyTask(table_name, id, type, par, foldername, createdBy, taskHeading, taskDetails, date, 0)
        elif type == '3':
            deleteTask(table_name, id)

        return HttpResponse("y")

@csrf_exempt
def getProjectsPy(request):
    if  request.method == 'POST':
        mode = request.POST['mode']
        username = request.POST['username']
        if mode == '0':
            result = allProjects(username+'projects')
            return HttpResponse(json.dumps(result))
        elif mode == '1':
            scrum = request.POST['currentScrum']
            sprint = request.POST['currentSprint']
            project = request.POST['projectName']
            modifyProject(username+'projects', project, scrum, sprint)
            if scrum == '1' and sprint == '0':
                create_taskTable(username+project+str(scrum)+'tasks') 
                createTable(username+project+str(scrum)+'meets') 
            if sprint == '1':
                create_taskTable(username+project+str(scrum)+'sprint')  
            return HttpResponse('y')


@csrf_exempt
def taskFunctionPy(request):
    if request.method == 'POST':

        table_name = request.POST['table_name']
        type = request.POST['type_']
        id = request.POST['id']
        createdBy = request.POST['createdBy']
        taskHeading = request.POST['taskHeading']
        taskDetails = request.POST['taskDetails']
        createdOn = request.POST['createdOn']
        completed = request.POST['completed']
        deadline = request.POST['deadline']

        date = str(datetime.datetime.today())
        date = date[0:10]

        if type == '1':
            insertTask(table_name, createdBy, taskHeading, taskDetails, date, completed, deadline)
        elif type == '2':
            modifyTask(table_name, id, createdBy, taskHeading, taskDetails, createdOn, completed, deadline)
        elif type == '3':
            deleteTask(table_name, id)

        return HttpResponse("y")

@csrf_exempt
def insertProject(request):
    if request.method == 'POST':
        model = request.POST['model']
        projectName = request.POST['projectName']
        table_name = request.POST['table_name']
        createdBy = request.POST['createdBy']
        createdOn = request.POST['createdOn']
        description = request.POST['description']

        insertProjectIntoTable(table_name, createdBy, createdOn, model, projectName, description, 0, 0)
        return HttpResponse('y')


@csrf_exempt
def insertComment(request):
    if request.method == 'POST':
        print(request.POST)
        createdBy = request.POST['createdBy']
        createdOn = request.POST['createdOn']
        feedback = request.POST['feedback']
        rating = request.POST['rating']
        insertFeedback(createdBy, createdOn, feedback, rating)
        return HttpResponse('y')

@csrf_exempt
def isTrueCredentials(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        if( isUser(username) ):
            if( isTrueCredentialscorrect(username, password) ):
                return HttpResponse('C')
            else:
                return HttpResponse('W')
        else:
            return HttpResponse('U')
        
@csrf_exempt
def insertUser(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        git = request.POST['git']
        password = request.POST['password']
        b = insertUserIntoTable(username, password)
        print("b = ", b)
        if b == True:
            c = insertDetails(git, username,'', '', email) 
            create_projecttable(username+'projects')
            print("c = ", c)
            return HttpResponse('S')
        else:
            return HttpResponse('E')


@csrf_exempt
def noticeFunctionPy(request):
    if request.method == 'POST':

        table_name = request.POST['table_name']
        type = request.POST['type_']
        id = request.POST['id']
        createdBy = request.POST['createdBy']
        createdOn = request.POST['createdOn']
        description = request.POST['description']

        date = str(datetime.datetime.today())
        date = date[0:10]

        if type == '1':
            insertNotice(table_name, createdBy, date, description)
        elif type == '2':
            modifyNotice(table_name, id, createdBy, createdOn, description)
        elif type == '3':
            deleteNotice(table_name, id)

        return HttpResponse("n")

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
