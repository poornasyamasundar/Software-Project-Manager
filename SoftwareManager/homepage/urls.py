from django.urls import path
from . import views

urlpatterns = [
        path('', views.index, name = 'index'),
        path('testGET', views.testGET, name = 'testGET'),
        path('testPOST', views.testPOST, name = 'testPOST')
        ]
