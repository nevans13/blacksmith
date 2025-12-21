# blacksmith web server
# v1.0.0 - 10/12/2025
# nevans13

import os, threading, time
from collector import isOnline
from flask import Flask, redirect, request, send_from_directory, url_for
from tinydb import TinyDB, Query
from uuid import uuid4
from validator import vdt

# Create or import the databases
settingsDB = TinyDB("settingsDB.json")
deviceDB = TinyDB("deviceDB.json")

# Create Flask app
# Static content is served automatically from "static" directory
app = Flask(__name__)

# Create a recurring process to update the last device status in the database
#threading.Thread(Target=isOnline, args=(deviceDB.all().primaryIP,))

# Implicit index get route - redirect to index page
@app.route("/")
def index(): return redirect(url_for("static", filename="index.html"))

# Route for favicon image
@app.route("/favicon.ico")
def favicon(): return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico", mimetype="image/vnd.microsoft.icon")

# Route for listing all devices or creating a device
@app.route("/api/v1/devices", methods=["GET", "POST"])
def devices():
    # Get all devices
    if request.method == "GET":
        try:
            return deviceDB.all(), 200
        except:
            return "ERROR", 500

   # Create a device 
    elif request.method == "POST":
        try:
            if not vdt(request.args.get("hostname", type=str), "hostname"): raise ValueError("Hostname is not valid")
            if not vdt(request.args.get("tags", type=str), "tags"): raise ValueError("Tags are not valid")
            deviceDB.insert({"id": str(uuid4()), "hostname": request.args.get("hostname", type=str), "tags": request.args.get("tags", type=str).split("*")})
            return "CREATED", 201
        except: 
            return "ERROR", 500
    
    else:
        return "ERROR: invalid request method", 405

# Route to get or modify a single device
@app.route("/api/v1/devices/<string:deviceId>", methods=["GET", "PUT"])
def device(deviceId):
    if request.method == "GET":
        try:
            deviceQuery = Query()
            return deviceDB.search(deviceQuery.id == deviceId), 200
        except:
            return "ERROR", 500
    
    elif request.method == "PUT":
        try:
            # Check if the record exists
            deviceQuery = Query()
            queryResult = deviceDB.search(deviceQuery.id == deviceId)
            if len(queryResult) < 1: return "ERROR: device with ID " + deviceId + " not found" , 404
            elif len(queryResult) > 1: return "ERROR: more than one device with ID " + deviceId + " found" , 400
            else:
                # Update device properties, checking if they were included in the request
                if request.args.get("hostname", type=str): deviceDB.update({"hostname": request.args.get("hostname", type=str)}, deviceQuery.id==deviceId)
                if request.args.get("tags", type=str): deviceDB.update({"tags": request.args.get("tags", type=str).split("*")}, deviceQuery.id==deviceId)
                if request.args.get("primaryIP", type=str): deviceDB.update({"primaryIP": request.args.get("primaryIP", type=str)}, deviceQuery.id==deviceId)
                return "UPDATED", 200
        except:
            return "ERROR: unexpected error with device update", 500
    
    else:
        return "ERROR: invalid request method", 405

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