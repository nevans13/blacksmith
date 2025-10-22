# blacksmith web server
# v1.0.0 - 10/12/2025
# nevans13

import os
from flask import Flask, redirect, request, send_from_directory, url_for
from tinydb import TinyDB, Query
from uuid import uuid4
from validator import vdt

# Create or import the databases
settingsDB = TinyDB("settingsDB.json")
deviceDB = TinyDB("deviceDB.json")

# Create Flask app
app = Flask(__name__)

# Implicit index get route - redirect to index page
@app.route("/")
def index(): return redirect(url_for("static", filename="index.html"))

# Route for favicon image
@app.route("/favicon.ico")
def favicon(): return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico", mimetype="image/vnd.microsoft.icon")

# Route for device list
@app.route("/api/v1/devices", methods=["GET"])
def listDevices():
    return deviceDB.all()

# Route to get a single device
#@app.route("/api/v1/device/<str:deviceID>", methods=["POST"])
#def getDevice():

# Route to create a single device
@app.route("/api/v1/device", methods=["POST"])
def createDevice():
    try:
        deviceDB.insert({"id": str(uuid4()), "hostname": vdt(request.args.get("hostname", type=str), "hostname")})
        return "CREATED", 201
    except: 
        return "ERROR", 500