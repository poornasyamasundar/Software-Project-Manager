from django.shortcuts import render

def index(request):
    return render(request, 'project.html')

# Create your views here.
