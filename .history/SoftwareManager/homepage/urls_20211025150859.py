from django.urls import path
from . import views

urlpatterns = [
        path('', views.index, name = 'index'),
        path('testGET', views.testGET, name = 'testGET'),
        path('testPOST', views.testPOST, name = 'testPOST'),
        path('to_getTasksPy', views.to_getTasksPy, name = 'to_getTasksPy'),
        path('to_getMeetsPy', views.to_getMeetsPy, name = 'to_getMeetsPy'),
        path('to_getNoticesPy', views.to_getNoticesPy, name = 'to_getNoticesPy'),
        path('to_getBacklogsPy', views.to_getBacklogsPy, name = 'to_getBacklogsPy'),
        path('to_getCommentsPy', views.to_getCommentsPy, name = 'to_getCommentsPy'),
        path('meetingFunctionPy', views.meetingFunctionPy, name = 'meetingFunctionPy'),
        path('taskFunctionPy', views.taskFunctionPy, name = 'taskFunctionPy'),
        path('noticeFunctionPy', views.noticeFunctionPy, name = 'noticeFunctionPy'),
        path('isUser', views.isUser, name = 'isUser'),
        path('isTrueCredentials', views.isTrueCredentials, name = 'isTrueCredentials'),
        path('insertUser', views.insertUser , name = 'insertUser'),
        path('insertProject', views.insertProject , name = 'insertProject'),
        

]
