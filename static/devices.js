// Javascript for devices.html frontend
// v1.0.0 - 10/15/2025
// nevans13

// Helper function to add a query parameter to a URL
function addQueryParameter(url, id, value) {
  // Verify strings with no whitespace
  url = url.toString().trim();
  id = id.toString().trim();
  value = value.toString().trim();

  if (url.length === 0 || id.length === 0 || value.length === 0) {
    throw new Error("Invalid addQueryParameter call - input value(s) too short");
  }
  if (url.indexOf("?") === -1) {
    return url + "?" + id + "=" + value;
  } else {
    return url + "&" + id + "=" + value;
  }
}

// Get a list of devices
async function getDevices() {
  const url = origin + "/api/v1/devices";
  try {
    const response = await fetch(url, {method: "GET"});
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

// Get a single device
async function getDevice(deviceId) {
  const url = origin + "/api/v1/devices/" + deviceId.toString().trim();
  try {
    const response = await fetch(url, {method: "GET"});
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

// Create a new device
async function createDevice(hostname="") {
  var url = origin + "/api/v1/devices";
  if (hostname !== "") {
    url = addQueryParameter(url, "hostname", hostname);
  }
  try {
    const response = await fetch(url, {method: "POST"});
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return;
  } catch (error) {
    console.error(error.message);
  }
}

// Create a new device by adding a row to the device table
function createNewDevice() {
  // Show the device table if it is hidden
  if (document.getElementById("deviceTable").hasAttribute("hidden")) {document.getElementById("deviceTable").removeAttribute("hidden");}

  // Update buttons
  document.getElementById("createNewDeviceButton").setAttribute("hidden", "");
  document.getElementById("saveNewDeviceButton").removeAttribute("hidden");
  document.getElementById("cancelNewDeviceButton").removeAttribute("hidden");

  // Create new row with textboxes for device details
  let devicesHostname = document.createElement("input");
  devicesHostname.setAttribute("id", "newDeviceHostname");
  let devicesHostnameRow = document.createElement("td");
  let devicesGroup = document.createElement("input");
  devicesGroup.setAttribute("id", "newDeviceGroup");
  let devicesGroupRow = document.createElement("td");
  let devicesTableRow = document.createElement("tr");
  devicesTableRow.setAttribute("id", "newDeviceRow");
  devicesTableRow.appendChild(devicesHostnameRow);
  devicesHostnameRow.appendChild(devicesHostname);
  devicesTableRow.appendChild(devicesGroupRow);
  devicesGroupRow.appendChild(devicesGroup);
  document.getElementById("deviceTable").appendChild(devicesTableRow);
}

// Save the new device
function saveNewDevice() {
  createDevice(document.getElementById("newDeviceHostname").value).then(() => {
    // Update buttons
    document.getElementById("saveNewDeviceButton").setAttribute("hidden", "");
    document.getElementById("cancelNewDeviceButton").setAttribute("hidden", "");
    document.getElementById("createNewDeviceButton").removeAttribute("hidden");

    // Delete input row
    document.getElementById("newDeviceRow").remove();

    // Reload the page
    window.location.reload();
  });
}

// Cancel creating a new device
function cancelNewDevice() {
  // Update buttons
  document.getElementById("saveNewDeviceButton").setAttribute("hidden", "");
  document.getElementById("cancelNewDeviceButton").setAttribute("hidden", "");
  document.getElementById("createNewDeviceButton").removeAttribute("hidden");

  // Delete input row
  document.getElementById("newDeviceRow").remove();
}

// Edit an existing device by editing the parameters in the device detail table
function editDevice() {
  // Update buttons
  document.getElementById("editDeviceButton").setAttribute("hidden", "");
  document.getElementById("saveEditDeviceButton").removeAttribute("hidden");
  document.getElementById("cancelEditDeviceButton").removeAttribute("hidden");

  // Convert the device parameters from text to a pre-filled textbox
  
}

// Cancel editing an existing device
function cancelEditDevice() {
  // Update buttons
  document.getElementById("saveEditDeviceButton").setAttribute("hidden", "");
  document.getElementById("cancelEditDeviceButton").setAttribute("hidden", "");
  document.getElementById("editDeviceButton").removeAttribute("hidden");

  // Delete input row
  document.getElementById("newDeviceRow").remove();
}

// Add devices to the device table
getDevices().then((value) => {
  // Hide the device table if there are no devices
  if (value.length === 0) {
    document.getElementById("deviceTable").setAttribute("hidden", "");
  }

  // Build the table row
  value.forEach(element => {
    let devicesHostname = document.createTextNode(element.hostname.toString().trim());
    let devicesHostnameLink = document.createElement("a");
    let devicesHostnameRow = document.createElement("td");
    let devicesGroup = document.createTextNode("element.deviceGroup.toString().trim()");
    let devicesGroupRow = document.createElement("td");
    let devicesTableRow = document.createElement("tr");
    devicesTableRow.appendChild(devicesHostnameRow);
    devicesHostnameRow.appendChild(devicesHostnameLink);
    devicesHostnameLink.appendChild(devicesHostname);
    devicesTableRow.appendChild(devicesGroupRow);
    devicesGroupRow.appendChild(devicesGroup);
    
    // Create the link to manage the individual device
    // The device hostname link also has the unique ID of the device in the database
    devicesHostnameLink.setAttribute("id", element.id.toString().trim());
    devicesHostnameLink.setAttribute("href", "#");
    devicesHostnameLink.addEventListener("click", (event) => {
      
      // Get the device details
      getDevice(event.target.id.toString().trim()).then((deviceValue) => {
        // Add content to the device detail table
        document.getElementById("deviceDetailHostname").innerText = deviceValue[0].hostname.toString().trim();
      });

      // Update the page after hydrating the device detail table
      document.getElementById("deviceTableDiv").setAttribute("hidden", "");
      document.getElementById("deviceDetailDiv").removeAttribute("hidden");
    });

    // Add the table row to the table
    document.getElementById("deviceTable").appendChild(devicesTableRow);
  });
});