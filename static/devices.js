// Javascript for index.html frontend
// v1.0.0 - 10/15/2025
// nevans13

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

// Add devices to the device table
getDevices().then((value) => {
  value.forEach(element => {
    console.log(element);
    let devicesHostname = document.createElement("td").appendChild(document.createTextNode(element.hostname.toString().trim()));
    let devicesGroup = document.createElement("td").appendChild(document.createTextNode("element.deviceGroup.toString().trim()"));
    let devicesTableRow = document.createElement("tr");
    devicesTableRow.appendChild(devicesHostname);
    devicesTableRow.appendChild(devicesGroup);
    document.getElementById("device-table").appendChild(devicesTableRow);
  });
});