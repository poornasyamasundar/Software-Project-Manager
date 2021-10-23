from django.shortcuts import render

def index(request):
    return render(request, 'newProject.html')

# Create your views here.
