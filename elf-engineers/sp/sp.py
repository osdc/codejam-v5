from flask import Flask, redirect, request, jsonify, render_template
import requests
import os

app = Flask(__name__,template_folder='qwerty')

SPOTIFY_CLIENT_ID = 'dca2bac0338b43adb44d819b78011f6b'
SPOTIFY_CLIENT_SECRET = '9ab6185a54494c80b4aa34fc9ae24a29'
SPOTIFY_REDIRECT_URI = 'http://127.0.0.1:5000/callback_sp'

# In-memory storage for simplicity
tokens = {}
@app.route('/focus')
def home_sp():
    return render_template('index.html')  # Changed to show index.html directly

@app.route('/login_sp')
def login_sp():
    auth_url = (
        f"https://accounts.spotify.com/authorize"
        f"?client_id={SPOTIFY_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={SPOTIFY_REDIRECT_URI}"
        f"&scope=user-read-playback-state user-modify-playback-state streaming"
    )
    return redirect(auth_url)

@app.route('/callback_sp')
def callback_sp():
    code = request.args.get('code')
    response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': SPOTIFY_REDIRECT_URI,
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET,
        }
    )
    response_data = response.json()
    access_token = response_data['access_token']
    refresh_token = response_data['refresh_token']

    # Store tokens (for simplicity, replace with a database for real use)
    tokens['access_token'] = access_token
    tokens['refresh_token'] = refresh_token

    return jsonify({'message': 'Login successful. You can now control Spotify.', 'tokens': tokens})

@app.route('/get_token_sp')
def get_token_sp():
    return jsonify({'access_token': tokens.get('access_token')})

if __name__ == "__main__":
    app.run(debug=True)
