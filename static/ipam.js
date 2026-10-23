// Javascript for ipam.html frontend
// v1.0.0 - 12/27/2025
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

// Get a list of IPAM prefixes
async function getPrefixes() {
  const url = origin + "/api/v1/prefixes";
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

// Get a single IPAM prefix
async function getPrefix(prefixId) {
  const url = origin + "/api/v1/prefixes/" + prefixId.toString().trim();
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

// Create a new IPAM prefix
async function createPrefix(prefix="", description="", tags="") {
  // Create URL and add query parameters
  var url = origin + "/api/v1/prefixes";
  url = addQueryParameter(url, "prefix", prefix);
  url = addQueryParameter(url, "description", description);
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

// Update an existing IPAM prefix
async function updatePrefix(prefixId, prefix="", description="", tags="") {
  // Create URL and add query parameters
  var url = origin + "/api/v1/prefixes/" + prefixId.toString().trim();
  if (prefix != "") {url = addQueryParameter(url, "prefix", prefix);}
  if (description != "") {url = addQueryParameter(url, "description", description);}
  if (tags != "") {url = addQueryParameter(url, "tags", tags);}

  // Place HTTP PUT request to update IPAM prefix
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

// Create a new IPAM prefix by adding a row to the prefix table
function createNewPrefix() {
  // Show the prefix table if it is hidden
  if (document.getElementById("prefixTable").hasAttribute("hidden")) {document.getElementById("prefixTable").removeAttribute("hidden");}

  // Update buttons
  document.getElementById("createNewPrefixButton").setAttribute("hidden", "");
  document.getElementById("saveNewPrefixButton").removeAttribute("hidden");
  document.getElementById("cancelNewPrefixButton").removeAttribute("hidden");

  // Create new row with textboxes for prefix details
  // Create elements for CIDR prefix
  let newPrefix = document.createElement("input");
  newPrefix.setAttribute("id", "newPrefix");
  let newPrefixColumn = document.createElement("td");

  // Create elements for prefix description
  let newPrefixDescription = document.createElement("input");
  newPrefixDescription.setAttribute("id", "newPrefixDescription");
  let newPrefixDescriptionColumn = document.createElement("td");
  
  // Create elements for prefix tags
  let newPrefixTags = document.createElement("select");
  newPrefixTags.setAttribute("id", "newPrefixTags");
  newPrefixTags.setAttribute("name", "newPrefixTags");
  newPrefixTags.setAttribute("multiple", "");
  getTags().then((tags) => {
    tags.forEach(element => {
      let prefixTagOption = document.createElement("option");
      prefixTagOption.setAttribute("value", element.toString().trim());
      prefixTagOption.innerText = element.toString().trim();
      document.getElementById("newPrefixTags").appendChild(prefixTagOption);
    });
  });

  let newPrefixTagsColumn = document.createElement("td");
  
  // Add the elements to the table row, starting with the parent element and moving to each child
  let newPrefixTableRow = document.createElement("tr");
  newPrefixTableRow.setAttribute("id", "newPrefixTableRow");
  newPrefixTableRow.appendChild(newPrefixColumn);
  newPrefixColumn.appendChild(newPrefix);
  newPrefixTableRow.appendChild(newPrefixDescriptionColumn);
  newPrefixDescriptionColumn.appendChild(newPrefixDescription);
  newPrefixTableRow.appendChild(newPrefixTagsColumn);
  newPrefixTagsColumn.appendChild(newPrefixTags);
  document.getElementById("prefixTable").appendChild(newPrefixTableRow);
}

// Save the new IPAM prefix
function saveNewPrefix() {
  // Define parameters for the prefix
  let prefix = document.getElementById("newPrefix").value;
  let description = document.getElementById("newPrefixDescription").value;

  // Tags are included as a query parameter string, seperated by an asterisk
  let tags = "";

  // Check if there are any tags defined before proceeding
  if (document.getElementById("newPrefixTags").children.length >= 1) {
    Array.from(document.getElementById("newPrefixTags").children).forEach(option => {
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

  createPrefix(prefix, description, tags).then(() => {
    // Update buttons
    document.getElementById("saveNewPrefixButton").setAttribute("hidden", "");
    document.getElementById("cancelNewPrefixButton").setAttribute("hidden", "");
    document.getElementById("createNewPrefixButton").removeAttribute("hidden");

    // Delete input row
    document.getElementById("newPrefixTableRow").remove();

    // Reload the page
    window.location.reload();
  });
}

// Cancel creating a new IPAM prefix
function cancelNewPrefix() {
  // Update buttons
  document.getElementById("saveNewPrefixButton").setAttribute("hidden", "");
  document.getElementById("cancelNewPrefixButton").setAttribute("hidden", "");
  document.getElementById("createNewPrefixButton").removeAttribute("hidden");

  // Delete input row
  document.getElementById("newPrefixTableRow").remove();
}

// Add prefixes to the device table
getPrefixes().then((value) => {
  // Hide the prefix table if there are no prefixes
  if (value.length === 0) {
    document.getElementById("prefixTable").setAttribute("hidden", "");
    return;
  }

  // Build the table row
  value.forEach(element => {
    let prefix = document.createTextNode(element.prefix.toString().trim());
    let prefixColumn = document.createElement("td");
    let prefixDescription = document.createTextNode(element.description.toString().trim());
    let prefixDescriptionColumn = document.createElement("td");
    let prefixTags = document.createTextNode(element.tags.join(", ").toString().trim());
    let prefixTagsColumn = document.createElement("td");
    let prefixEdit = document.createElement("button");
    prefixEdit.innerText = "Edit";
    prefixEdit.setAttribute("class", "actionButton")
    let prefixEditColumn = document.createElement("td");
    let prefixTableRow = document.createElement("tr");
    prefixTableRow.appendChild(prefixColumn);
    prefixColumn.appendChild(prefix);
    prefixTableRow.appendChild(prefixDescriptionColumn);
    prefixDescriptionColumn.appendChild(prefixDescription);
    prefixTableRow.appendChild(prefixTagsColumn);
    prefixTagsColumn.appendChild(prefixTags);
    prefixTableRow.appendChild(prefixEditColumn);
    prefixEditColumn.appendChild(prefixEdit);
    
    // Create the actions buttons to manage the individual prefixes
    // The prefix action buttons in the main prefix table in the Actions column also have the unique ID of the prefix in the database
    prefixEdit.setAttribute("id", element.id.toString().trim());
    prefixEdit.setAttribute("href", "#");
    prefixEdit.addEventListener("click", (event) => {
      const prefixId = event.target.id.toString().trim();
      getPrefix(prefixId).then((prefixValue) => {
        // IPAM entries are edited directly in the prefix table
        // Replace the IPAM entry fields with pre-populated input boxes
        // Replace the prefix cell
        const prefixCell = document.getElementById(prefixId).closest("tr")?.cells[0];
        const prefixCellInput = document.createElement("input");
        prefixCellInput.setAttribute("id", "prefixCellInput");
        prefixCellInput.setAttribute("data-original-value", prefixValue[0].prefix.toString().trim()); // saves the original value in case the input field is modified before clicking Cancel
        prefixCellInput.value = prefixValue[0].prefix.toString().trim();
        prefixCell.innerHTML = "";
        prefixCell.appendChild(prefixCellInput);

        // Replace the description cell
        const prefixDescriptionCell = document.getElementById(prefixId).closest("tr")?.cells[1];
        const prefixDescriptionCellInput = document.createElement("input");
        prefixDescriptionCellInput.setAttribute("id", "prefixDescriptionCellInput");
        prefixDescriptionCellInput.setAttribute("data-original-value", prefixValue[0].description.toString().trim()); // saves the original value in case the input field is modified before clicking Cancel
        prefixDescriptionCellInput.value = prefixValue[0].description.toString().trim();
        prefixDescriptionCell.innerHTML = "";
        prefixDescriptionCell.appendChild(prefixDescriptionCellInput);

        // Replace the Edit button with Save and Cancel buttons
        document.getElementById(prefixId).setAttribute("hidden", "");
        const prefixActionsCell = document.getElementById(prefixId).closest("tr")?.cells[3];
        const prefixActionsSaveButton = document.createElement("button");
        prefixActionsSaveButton.setAttribute("class", "actionButton");
        prefixActionsSaveButton.innerText = "Save";
        prefixActionsSaveButton.addEventListener("click", () => {});
        const prefixActionsCancelButton = document.createElement("button");
        prefixActionsCancelButton.setAttribute("class", "actionButton");
        prefixActionsCancelButton.innerText = "Cancel";
        prefixActionsCancelButton.addEventListener("click", () => { // restore the Edit button and delete the Save/Cancel buttons
          prefixCell.innerText = prefixCellInput.getAttribute("data-original-value");
          prefixDescriptionCell.innerText = prefixDescriptionCellInput.getAttribute("data-original-value");
          prefixActionsSaveButton.remove();
          prefixActionsCancelButton.remove();
          document.getElementById(prefixId).removeAttribute("hidden");
        });
        prefixActionsCell.appendChild(prefixActionsSaveButton);
        prefixActionsCell.appendChild(prefixActionsCancelButton);
      });
    });

    // Add the table row to the table
    document.getElementById("prefixTable").appendChild(prefixTableRow);
  });
});