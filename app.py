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
prefixDB = TinyDB("prefixDB.json")

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
            if not vdt(request.args.get("hostname", type=str), "hostname"): raise ValueError("Error: hostname is not valid")
            if not vdt(request.args.get("tags", type=str), "tags"): raise ValueError("ERROR: tags are not valid")
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
    
# Route for listing all prefixes or creating a prefix
# v1 API does not support IPv6
@app.route("/api/v1/prefixes", methods=["GET", "POST"])
def prefixes():
    # Get all prefixes
    if request.method == "GET":
        try:
            return prefixDB.all(), 200
        except:
            return "ERROR", 500

   # Create a prefix 
    elif request.method == "POST":
        try:
            if not vdt(request.args.get("prefix", type=str), "prefix"): raise ValueError("ERROR: prefix is not valid")
            if not vdt(request.args.get("description", type=str), "description"): raise ValueError("ERROR: description is not valid")
            if not vdt(request.args.get("tags", type=str), "tags"): raise ValueError("ERROR: tags are not valid")
            prefixDB.insert({"id": str(uuid4()), "prefix": request.args.get("prefix", type=str), "description": request.args.get("description", type=str), "tags": request.args.get("tags", type=str).split("*")})
            return "CREATED", 201
        except: 
            return "ERROR", 500
    
    else:
        return "ERROR: invalid request method", 405

# Route to modify a single prefix
@app.route("/api/v1/prefixes/<string:prefixId>", methods=["PUT"])
def prefix(prefixId):
    if request.method == "PUT":
        try:
            # Check if the record exists
            prefixQuery = Query()
            queryResult = prefixDB.search(prefixQuery.id == prefixId)
            if len(queryResult) < 1: return "ERROR: prefix with ID " + prefixId + " not found" , 404
            elif len(queryResult) > 1: return "ERROR: more than one prefix with ID " + prefixId + " found" , 400
            else:
                # Update prefix properties, checking if they were included in the request
                if request.args.get("prefix", type=str): prefixDB.update({"prefix": request.args.get("prefix", type=str)}, prefixQuery.id==prefixId)
                if request.args.get("description", type=str): prefixDB.update({"description": request.args.get("description", type=str)}, prefixQuery.id==prefixId)
                if request.args.get("tags", type=str): prefixDB.update({"tags": request.args.get("tags", type=str).split("*")}, prefixQuery.id==prefixId)
                return "UPDATED", 200
        except:
            return "ERROR: unexpected error with prefix update", 500
    
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

        # Get prefix tags
        for prefix in prefixDB.all():
            # Skip prefix if no tags
            if "tags" not in device.keys(): continue

            # Handle if the tags field is either a single value or a list/set of values
            if type(prefix["tags"]) == str: allTags.add(prefix["tags"])
            elif type(prefix["tags"]) == list or type(prefix["tags"]) == set:
                for tag in prefix["tags"]: allTags.add(tag)
            else: return "ERROR: tags on prefix are of invalid type", 500
        
        return list(allTags), 200

    except:
        return "ERROR", 500