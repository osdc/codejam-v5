from django.shortcuts import render
import json
import os
import requests

# Path to the cache file for metadata
METADATA_CACHE_FILE = 'metadata_cache.json'

def load_cached_metadata():
    """
    Load the cached metadata from the local cache.
    """
    if not os.path.exists(METADATA_CACHE_FILE):
        return None
    
    # Load the cached metadata
    with open(METADATA_CACHE_FILE, 'r') as f:
        cached_metadata = json.load(f)

    return cached_metadata

def fetch_and_cache_metadata():
    """
    Fetch the metadata for courses, semesters, and batches and cache it locally.
    """
    METADATA_URL = "https://raw.githubusercontent.com/codelif/jiit-planner-cdn/main/metadata.json"

    try:
        # Fetch the metadata from the URL
        response = requests.get(METADATA_URL)
        response.raise_for_status()
        metadata = response.json()

        # Save the fetched metadata to local cache file
        with open(METADATA_CACHE_FILE, 'w') as f:
            json.dump(metadata, f)

        return metadata

    except requests.RequestException as e:
        print(f"Error fetching metadata from CDN: {e}")
        return None
    except json.JSONDecodeError:
        print("Error parsing the metadata JSON data.")
        return None

def gconnect(request):
    """
    Handle the request to sync timetable and render the page with dynamic metadata.
    """
    # Load the cached metadata or fetch it if it's not cached
    cached_metadata = load_cached_metadata()
    if not cached_metadata:
        cached_metadata = fetch_and_cache_metadata()

    # Pass the metadata to the template context
    print(cached_metadata)

    if cached_metadata:
        return render(request, 'gconnect.html', {
            'courses': cached_metadata['courses'],
            'semesters': cached_metadata['semesters'],
            'batches': cached_metadata['batches'],
        })
    else:
        return render(request, 'gconnect.html', {
            'error': "Unable to fetch metadata."
        })
