from django.shortcuts import render

def index(request):
    return render(request, 'spiral.html')

# Create your views here.
