# blacksmith web server
# v1.0.0 - 10/12/2025
# nevans13

from flask import Flask, redirect, url_for

app = Flask(__name__)

# Implicit index get route - redirect to index page
@app.route("/")
def hello_world(): return redirect(url_for("static", filename="index.html"))