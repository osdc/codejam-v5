from django.shortcuts import render, HttpResponse,redirect
from django.contrib.auth.models import User,auth
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.contrib import messages
from django.conf import settings
import json
from django.http import JsonResponse
import pandas as pd

import random
import requests
import pymongo

from . import google_sync
from . import ml


# Create your views here.

def index(request):
    return render(request,"index.html")


def handleSignUp(request):
    if request.method=='POST':
        fname = request.POST['fname']
        lname = request.POST['lname']
        username = request.POST['username']
        password = request.POST['pass1']
        pass2 = request.POST['pass2']
        email = request.POST['email']

        if(User.objects.filter(username=username).exists()):
            messages.info(request,'Username taken !')
        elif(User.objects.filter(email=email).exists()):
            messages.info(request,'Email taken !')
        elif(password!=pass2):
            messages.info("Passwords dont match !")
        else:
            user = User.objects.create_user(username=username,password=password,email=email,first_name=fname,last_name = lname)
            user.save()
        return redirect('/')        

def handleLogin(request):
    if(request.method=='POST'):
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username,password=password)

        if user is not None:
            auth.login(request,user)
        else:
            messages.info(request," Wrong credentials ! Please enter your credentials properly !")
    return redirect('/')

def handleLogout(request):
    auth.logout(request)
    return redirect("/")

def about(request):
    return render(request,"about.html")

def get_sync_progress(request):
    progress = request.session.get('sync_progress', 0)  # Get the progress from the session
    return JsonResponse({'progress': progress})

def attendance_view(request):
    # Logic for handling attendance
    return render(request, 'attendance.html')

def studyplanner(request):
    return render(request,"study_planner.html")

def paper_trend_analysis(request):
    if(request.method=="POST"):
        subject = request.POST.get("subject")
        lb1 =    int(request.POST.get("lab1",0))
        lb2 =     int(request.POST.get("lab2",0))
        internals =     int(request.POST.get("internals",0))
        total = lb1 + lb2 + internals
        grade = ml.predict(total,subject)
        return render(request,"predicted_grade_result.html",{"predicted_grade":grade['grade'],"confidence_score":grade['confidence']})
    return render(request,"predict_grade.html")
