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
    try:
        return deviceDB.all(), 200
    except:
        return "ERROR", 500

# Route to get a single device
@app.route("/api/v1/devices/<string:deviceId>", methods=["GET"])
def getDevice(deviceId):
    try:
        deviceQuery = Query()
        return deviceDB.search(deviceQuery.id == deviceId), 200
    except:
        return "ERROR", 500

# Route to create a single device
@app.route("/api/v1/devices", methods=["POST"])
def createDevice():
    try:
        if not vdt(request.args.get("hostname", type=str), "hostname"): raise ValueError("Hostname is not valid")
        if not vdt(request.args.get("tags", type=str), "tags"): raise ValueError("Tags are not valid")
        deviceDB.insert({"id": str(uuid4()), "hostname": request.args.get("hostname", type=str), "tags": request.args.get("tags", type=str).split("*")})
        return "CREATED", 201
    except: 
        return "ERROR", 500

# Route to get tags in use by blacksmith
@app.route("/api/v1/tags", methods=["GET"])
def getTags():
    try:
        allTags = set()

        # Get device tags
        for device in deviceDB.all():
            # Skip device if no tags
            if "tags" not in device.keys(): continue

            # Handle if the tags field is either a single value or a list/set of values
            if type(device["tags"]) == str: allTags.add(device["tags"])
            elif type(device["tags"]) == list or type(device["tags"]) == set:
                for tag in device["tags"]: allTags.add(tag)
            else: return "ERROR: tags on device are of invalid type", 500
        
        return list(allTags), 200

    except:
        return "ERROR", 500