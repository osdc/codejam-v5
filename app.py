from flask import Flask, render_template
import random

app = Flask(__name__)

quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Strive not to be a success, but rather to be of value. - Albert Einstein",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "The best way to predict your future is to create it. - Peter Drucker",
    "The journey of a thousand miles begins with a single step. - Lao Tzu",
     "The mind is everything. What you think you become. - Buddha",
    "Be the change that you wish to see in the world. - Mahatma Gandhi",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier. - Mother Teresa"
]

def get_random_quote():
    return random.choice(quotes)

@app.route("/")
def home():
    quote = get_random_quote()
    return render_template("index.html", quote=quote)

@app.route("/introduction")
def introduction():
    return render_template("introduction.html")

@app.route("/signin")
def signin():
    return render_template("signin.html")

@app.route("/codejam")
def codejam():
    return render_template("codejam.html")

@app.route("/team")
def team():
    return render_template("team.html")


if __name__ == "__main__":
    app.run(debug=True, port=8000)