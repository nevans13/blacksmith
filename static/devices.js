// Javascript for 
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
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}