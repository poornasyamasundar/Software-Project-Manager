from django.urls import path
from . import views

urlpatterns = [
        path('', views.index, name = 'index'),
        path('testGET', views.testGET, name = 'testGET'),
        path('testPOST', views.testPOST, name = 'testPOST'),
        path('to_getTasksPy', views.to_getTasksPy, name = 'to_getTasksPy'),
        path('to_getNoticesPy', views.to_getNoticesPy, name = 'to_getNoticesPy'),
        path('to_getCommentsPy', views.to_getCommentsPy, name = 'to_getCommentsPy'),
        path('to_getMeetingsPy', views.to_getMeetingsPy, name = 'to_getMeetingsPy'),
        path('meetingFunctionPy', views.meetingFunctionPy, name = 'meetingFunctionPy'),
        path('taskFunctionPy', views.taskFunctionPy, name = 'taskFunctionPy'),
        path('noticeFunctionPy', views.noticeFunctionPy, name = 'noticeFunctionPy')
]
