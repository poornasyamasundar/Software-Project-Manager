from django.urls import path
from . import views

urlpatterns = [
        path('', views.index, name = 'index'),
        path('testGET', views.testGET, name = 'testGET'),
        path('testPOST', views.testPOST, name = 'testPOST'),
        path('to_getTasksPy', views.to_getTasksPy, name = 'to_getTasksPy'),
        path('meetingFunctionPy', views.meetingFunctionPy, name = 'meetingFunctionPy')
]
