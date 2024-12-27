import os
import json
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from gcsa.event import Event
from gcsa.google_calendar import GoogleCalendar
from gcsa.calendar import Calendar
from gcsa.recurrence import Recurrence, DAILY
from django.http import HttpResponseForbidden
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from beautiful_date import *
from django.shortcuts import render, redirect
from . import getTTevents


def initiate_oauth(request):
    flow = Flow.from_client_secrets_file(
        os.path.join(settings.BASE_DIR, 'credentials/credentials.json'),
        scopes=["https://www.googleapis.com/auth/calendar"],
        redirect_uri='https://localhost:8000/oauth/callback/'  # Use your production URL here
    )

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )

    # Store the state in the session to be used later for validation
    request.session['batch_code'] = request.POST.get("batchCode")
    request.session['semester'] = request.POST.get("semester")
    request.session['course'] = request.POST.get("course")
    request.session['state'] = state

    # Redirect the user to Google's OAuth 2.0 server
    return redirect(authorization_url)

def oauth_callback(request):
    # Get the state parameter from the session
    stored_state = request.session.get('state')

    # Get the state from the callback request
    received_state = request.GET.get('state')

    # Compare the stored and received state values
    if stored_state != received_state:
        # If they do not match, raise an error (CSRF protection)
        return HttpResponseForbidden("CSRF verification failed: state mismatch.")

    # Initialize the OAuth flow using the stored state
    flow = Flow.from_client_secrets_file(
        os.path.join(settings.BASE_DIR, 'credentials/credentials.json'),
        scopes=["https://www.googleapis.com/auth/calendar"],
        state=stored_state,
        redirect_uri='https://localhost:8000/oauth/callback/'  # Ensure this matches the registered URI
    )

    # Exchange the authorization code for tokens
    flow.fetch_token(authorization_response=request.build_absolute_uri())

    # Retrieve credentials and store them in the session
    credentials = flow.credentials
    request.session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes,
    }

    # Redirect to the sync handler to complete the process
    return redirect('/sync-calendar/')

# Step 3: Use the credentials to interact with the Google Calendar API
def google_sync_handler(request):
    # Ensure credentials exist in the session
    if 'credentials' not in request.session:
        print("redirecting to google")
        return redirect('/initiate-oauth/')

    # Load credentials from the session
    credentials_data = request.session['credentials']
    credentials = Credentials(
        **credentials_data
    )

    # Initialize Google Calendar API client
    calendar_handle = GoogleCalendar(credentials=credentials)

    # Retrieve the batch_code, semester, and course from the session
    batch_code = request.session.get('batch_code')
    semester = request.session.get('semester')
    course = request.session.get('course')

    if not batch_code or not semester or not course:
        return JsonResponse({"error": "Missing session data for batch_code, semester, or course."}, status=400)

    # Assuming you have a function to generate a timetable or events based on batch_code, semester, and course
    # Replace with your actual timetable fetching and event creation logic
   # print(batch_code, semester,course, "*****************************")
    events = getTTevents.get_timetable_events(batch_code, semester, course)

   # Create a new calendar
    mycalendar = Calendar(
        f"Class schedule [{batch_code}] [{semester}]",
        description=f"Calendar displaying the class schedule for batch {batch_code} semester {semester} \nadded using Acadmate"
    )
    mycalendar = calendar_handle.add_calendar(mycalendar)



    # Iterate over the timetable events and add them to the Google Calendar
    x = 0
    request.session['sync_progress'] = 0  # Initialize progress
    for event_data in events:
        print((x/len(events))*100)  #Sync percent
        x += 1
        request.session['sync_progress'] = (x/len(events))*100

        # Create Event object with recurrence and reminders
        event = Event(
            event_data['title'],
            start=event_data['start_time'],
            end=event_data['end_time'],
            recurrence=[Recurrence.rule(freq=event_data['recurrence_frequency'])],  # This is just an example, you can adjust as needed
            minutes_before_email_reminder=event_data['reminder'],
            color_id=event_data['color']
        )

        # Add event to the calendar
        calendar_handle.add_event(event, calendar_id=mycalendar.id)


    request.session['sync_progress'] = 100
    return render(request, "sync-success.html")

