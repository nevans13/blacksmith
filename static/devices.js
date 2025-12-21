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

// Get tags in use by blacksmith
async function getTags() {
  var url = origin + "/api/v1/tags";
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
async function createDevice(hostname="", tags="") {
  // Create URL and add query parameters
  var url = origin + "/api/v1/devices";
  url = addQueryParameter(url, "hostname", hostname);
  url = addQueryParameter(url, "tags", tags);

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

// Update an existing device
async function updateDevice(deviceId, hostname="", tags="", primaryIP="") {
  // Create URL and add query parameters
  var url = origin + "/api/v1/devices/" + deviceId.toString().trim();
  if (hostname != "") {url = addQueryParameter(url, "hostname", hostname);}
  if (tags != "") {url = addQueryParameter(url, "tags", tags);}
  if (primaryIP != "") {url = addQueryParameter(url, "primaryIP", primaryIP);}

  // Place HTTP PUT request to update device
  try {
    const response = await fetch(url, {method: "PUT"});
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
  // Create elements for device hostname
  let devicesHostname = document.createElement("input");
  devicesHostname.setAttribute("id", "newDeviceHostname");
  let devicesHostnameColumn = document.createElement("td");
  
  // Create elements for device tags
  let devicesTags = document.createElement("select");
  devicesTags.setAttribute("id", "newDeviceTags");
  devicesTags.setAttribute("name", "newDeviceTags");
  devicesTags.setAttribute("multiple", "");
  getTags().then((tags) => {
    tags.forEach(element => {
      let devicesTagOption = document.createElement("option");
      devicesTagOption.setAttribute("value", element.toString().trim());
      devicesTagOption.innerText = element.toString().trim();
      document.getElementById("newDeviceTags").appendChild(devicesTagOption);
    });
  });
  
  let devicesTagsColumn = document.createElement("td");
  
  // Add the elements to the table row, starting with the parent element and moving to each child
  let devicesTableRow = document.createElement("tr");
  devicesTableRow.setAttribute("id", "newDeviceRow");
  devicesTableRow.appendChild(devicesHostnameColumn);
  devicesHostnameColumn.appendChild(devicesHostname);
  devicesTableRow.appendChild(devicesTagsColumn);
  devicesTagsColumn.appendChild(devicesTags);
  document.getElementById("deviceTable").appendChild(devicesTableRow);
}

// Save the new device
function saveNewDevice() {
  // Define parameters for the device
  let hostname = document.getElementById("newDeviceHostname").value;

  // Tags are included as a query parameter string, seperated by an asterisk
  let tags = "";

  // Check if there are any tags defined before proceeding
  if (document.getElementById("newDeviceTags").children.length >= 1) {
    Array.from(document.getElementById("newDeviceTags").children).forEach(option => {
      // Append the tag to the array if the option was selected in the multiselect
      if (option.selected) {
        // Add an asterisk before appending if the string has entries
        if (tags.length >= 2) {tags += "*"}
        tags += option.value.toString().trim();
      }
    });
  } else {
    tags = "default";
  }

  createDevice(hostname, tags).then(() => {
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
  // Create input to edit device hostname, pre-populate with current hostname, and add input to the table cell
  let deviceHostnameNew = document.createElement("input");
  deviceHostnameNew.setAttribute("id", "deviceHostnameNew");
  deviceHostnameNew.value = document.getElementById("deviceDetailHostname").innerText.toString();
  document.getElementById("deviceDetailHostname").innerText = "";
  document.getElementById("deviceDetailHostname").appendChild(deviceHostnameNew);

  // Create multiselect to edit tags
  let deviceTagsNew = document.createElement("select");
  deviceTagsNew.setAttribute("id", "deviceTagsNew");
  deviceTagsNew.setAttribute("name", "deviceTagsNew");
  deviceTagsNew.setAttribute("multiple", "");
  getTags().then((tags) => {
    tags.forEach(element => {
      let devicesTagOption = document.createElement("option");
      devicesTagOption.setAttribute("value", element.toString().trim());
      devicesTagOption.innerText = element.toString().trim();
      document.getElementById("deviceTagsNew").appendChild(devicesTagOption);
    });
  });
  document.getElementById("deviceDetailTags").innerText = "";
  document.getElementById("deviceDetailTags").appendChild(deviceTagsNew);

  // Create input to edit device primary IP, pre-populate with current primary IP, and add input to the table cell
  let devicePrimaryIPNew = document.createElement("input");
  devicePrimaryIPNew.setAttribute("id", "devicePrimaryIPNew");
  devicePrimaryIPNew.value = document.getElementById("deviceDetailPrimaryIP").innerText.toString();
  document.getElementById("deviceDetailPrimaryIP").innerText = "";
  document.getElementById("deviceDetailPrimaryIP").appendChild(devicePrimaryIPNew);
}

// Save the device edits based on the input boxes
function saveEditDevice() {
  // Define parameters for the device
  let hostname = document.getElementById("deviceHostnameNew").value;
  let tags = "";
  let primaryIP = document.getElementById("devicePrimaryIPNew").value;

  // Check if there are any tags defined before proceeding
  if (document.getElementById("deviceTagsNew").children.length >= 1) {
    Array.from(document.getElementById("deviceTagsNew").children).forEach(option => {
      // Append the tag to the array if the option was selected in the multiselect
      if (option.selected) {
        // Add an asterisk before appending if the string has entries
        if (tags.length >= 2) {tags += "*"}
        tags += option.value.toString().trim();
      }
    });
  } else {
    tags = "default";
  }

  // Get the device ID
  // Authentication will check if the user has permission to update the given device ID, so the field cannot just be modified in DevTools
  let deviceId = document.getElementById("deviceDetailDeviceId").innerText.toString().trim();
  updateDevice(deviceId, hostname, tags, primaryIP).then(() => {
    // Update buttons
    document.getElementById("saveEditDeviceButton").setAttribute("hidden", "");
    document.getElementById("cancelEditDeviceButton").setAttribute("hidden", "");
    document.getElementById("editDeviceButton").removeAttribute("hidden");

    // Reload the view by selecting the device again to refresh details
    document.getElementById(deviceId).click();
  });
}

// Cancel editing an existing device
function cancelEditDevice() {
  // Update buttons
  document.getElementById("saveEditDeviceButton").setAttribute("hidden", "");
  document.getElementById("cancelEditDeviceButton").setAttribute("hidden", "");
  document.getElementById("editDeviceButton").removeAttribute("hidden");

  // Delete input boxes
  document.getElementById("deviceHostnameNew").remove();
  document.getElementById("deviceTagsNew").remove();
  document.getElementById("devicePrimaryIPNew").remove();
}

// Add devices to the device table
getDevices().then((value) => {
  // Hide the device table if there are no devices
  if (value.length === 0) {
    document.getElementById("deviceTable").setAttribute("hidden", "");
    return;
  }

  // Build the table row
  value.forEach(element => {
    let devicesHostname = document.createTextNode(element.hostname.toString().trim());
    let devicesHostnameLink = document.createElement("a");
    let devicesHostnameColumn = document.createElement("td");
    let devicesTags = document.createTextNode(element.tags.join(", ").toString().trim());
    let devicesTagsColumn = document.createElement("td");
    let devicesTableRow = document.createElement("tr");
    devicesTableRow.appendChild(devicesHostnameColumn);
    devicesHostnameColumn.appendChild(devicesHostnameLink);
    devicesHostnameLink.appendChild(devicesHostname);
    devicesTableRow.appendChild(devicesTagsColumn);
    devicesTagsColumn.appendChild(devicesTags);
    
    // Create the link to manage the individual device
    // The device hostname link in the main device table also has the unique ID of the device in the database
    devicesHostnameLink.setAttribute("id", element.id.toString().trim());
    devicesHostnameLink.setAttribute("href", "#");
    devicesHostnameLink.addEventListener("click", (event) => {
      // Get the device details
      getDevice(event.target.id.toString().trim()).then((deviceValue) => {
        // Add content to the device detail table, first checking if optional values exist in the server response
        document.getElementById("deviceDetailDeviceId").innerText = element.id.toString().trim();
        document.getElementById("deviceDetailHostname").innerText = deviceValue[0].hostname.toString().trim();
        document.getElementById("deviceDetailTags").innerText = deviceValue[0].tags.join(", ").toString().trim();
        if (deviceValue[0].primaryIP) {document.getElementById("deviceDetailPrimaryIP").innerText = deviceValue[0].primaryIP.toString().trim();}
      });

      // Update the page after hydrating the device detail table
      document.getElementById("deviceTableDiv").setAttribute("hidden", "");
      document.getElementById("deviceDetailDiv").removeAttribute("hidden");
    });

    // Add the table row to the table
    document.getElementById("deviceTable").appendChild(devicesTableRow);
  });
});