from datetime import datetime, timedelta
import requests
import json
import os
from beautiful_date import D, hours, minutes
import random

# Path to the local cache file
CACHE_FILE = 'classes_cache.json'

def fetch_and_cache_data():
    """
    Fetch the latest timetable data from the CDN and cache it locally.
    """
    CDN_URL = "https://raw.githubusercontent.com/codelif/jiit-planner-cdn/main/classes.json"
    
    try:
        # Fetch the JSON data from the CDN
        response = requests.get(CDN_URL)
        response.raise_for_status()
        classes_data = response.json()

        # Save the fetched data to local cache file
        with open(CACHE_FILE, 'w') as f:
            json.dump(classes_data, f)

        return classes_data

    except requests.RequestException as e:
        print(f"Error fetching data from CDN: {e}")
        return None
    except json.JSONDecodeError:
        print("Error parsing the JSON data.")
        return None

def load_cached_data():
    """
    Load the cached timetable data from the local cache.
    """
    if not os.path.exists(CACHE_FILE):
        return None
    
    # Load the cached data
    with open(CACHE_FILE, 'r') as f:
        cached_data = json.load(f)

    return cached_data

def convert_to_24hr_format(time_str):
    """
    Convert time in AM/PM format to 24-hour format.
    """
    try:
        time_obj = datetime.strptime(time_str, '%I:%M %p')  # Parse using AM/PM format
        return time_obj.hour, time_obj.minute  # Return the hour and minute in 24-hour format
    except ValueError as e:
        print(f"Error converting time: {time_str} - {e}")
        return None, None



def generate_color(code,color_mapping,used_colors):
    """
    Generate a unique color ID for the given input string, ensuring no duplicates
    in the currently used colors. Recycles colors if all are used.

    Args:
        code (str): The input string for which to generate or retrieve a color ID.

    Returns:
        int: The color ID (1-11) for the input string.
    """
    if code in color_mapping:
        return color_mapping[code]  # Return the stored value if it exists


    color_id = random.randint(1,11)

    # Ensure the color ID is unique
    while color_id in used_colors:
        color_id = (color_id % 11) + 1  # Cycle through colors 1-11

    # If all colors are used, recycle
    if len(used_colors) >= 11:
        used_colors.clear()  # Clear the used colors set to allow recycling

    # Store the new color ID
    color_mapping[code] = color_id
    used_colors.add(color_id)
    return color_id





def get_timetable_events(batch, semester, course):
    color_mapping = {}
    used_colors = set()  

    """
    Fetch the timetable from the cache or CDN and convert it into event data.
    """
    # Load the cached data, if available
    cached_data = load_cached_data()

    if not cached_data:
        # If no cached data, fetch and cache it
        print("Fetching data from CDN...")
        cached_data = fetch_and_cache_data()

    if cached_data:
        # Format the semester as 'semX' and generate the key
        key = f"{course.lower()}_{semester.lower()}_{batch.lower()}"

        # Check if the key exists in the data
        if key in cached_data:
            # Get the timetable for the selected batch, course, and semester
            timetable = cached_data[key]['classes']
            events = []

            # Get the current week's start date (assuming Monday as the start of the week)
            current_date = D.today()
            start_of_week = current_date - timedelta(days=current_date.weekday())


            # Convert timetable to events
            for day, sessions in timetable.items():
                # Find the index of the day in the week
                day_index = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].index(day)
                day_date = start_of_week + timedelta(days=day_index)

                for session in sessions:
                    # Parse start and end times (assuming AM/PM conversion to 24hr format)
                    start_hour, start_minute = convert_to_24hr_format(session['start']) 
                    end_hour, end_minute = convert_to_24hr_format(session['end'])

                    # Check if the time conversion was successful
                    if start_hour is None or end_hour is None:
                        continue

                    # Use beautiful_date to set the start and end times
                    start_time = day_date + (start_hour * hours) + (start_minute * minutes) -5*hours-30*minutes
                    end_time = day_date + (end_hour * hours) + (end_minute * minutes) -5*hours-30*minutes

                    # Debugging: print the parsed start and end times
                    #print(f"Start Time: {start_time}")
                    #print(f"End Time: {end_time}")


                    event = {
                        'title': f"{session['subject']} at {session['venue']} - {session['teacher']}",
                        'start_time': start_time,  # Using beautiful_date for start_time
                        'end_time': end_time,  # Using beautiful_date for end_time
                        'recurrence_frequency': 'WEEKLY',  # Weekly recurrence
                        'reminder': 15,  # Reminder 15 minutes before
                        'color':generate_color(session['subject'],color_mapping,used_colors),
                #        'location': session['venue']
                    }
                    events.append(event)

            return events
        else:
            return f"No timetable found for batch '{batch}', course '{course}', semester '{semester}'."
    else:
        return "Error: No timetable data available."

# Example usage
# events = get_timetable_events("a1", "1", "btech")
# if isinstance(events, list):
#     for event in events:
#         print(json.dumps(event, indent=2, default=str))
# else:
#     print(events)
