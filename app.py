# blacksmith web server
# v1.0.0 - 10/12/2025
# nevans13

import os
from flask import Flask, redirect, send_from_directory, url_for

# Create Flask app
app = Flask(__name__)

# Implicit index get route - redirect to index page
@app.route("/")
def index(): return redirect(url_for("static", filename="index.html"))

# Route for favicon image
@app.route("/favicon.ico")
def favicon(): return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico", mimetype="image/vnd.microsoft.icon")