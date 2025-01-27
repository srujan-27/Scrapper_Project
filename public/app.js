let selectedPlatform = "";

function showInput(platform) {
  selectedPlatform = platform;

  // Update instructions based on the selected platform
  const platformText =
    platform === "youtube"
      ? "You selected YouTube. Paste the video link below:"
      : "You selected Instagram. Paste the profile or post link below:";
  document.getElementById("platformText").innerText = platformText;

  // Show the input field and fetch button
  document.getElementById("inputSection").style.display = "block";
}

async function fetchResults() {
  const link = document.getElementById("linkInput").value;

  // Validate input
  if (!link) {
    alert("Please enter a valid link.");
    return;
  }

  // Show a loading message
  document.getElementById("resultOutput").innerHTML = "<p>Loading results...</p>";
  document.getElementById("results").style.display = "block";

  try {
    // Send the API request to the back end
    const response = await fetch(`http://localhost:3000/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform: selectedPlatform, link }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch results.");
    }

    // Parse and display the results
    const result = await response.json();
    displayResults(result);
  } catch (err) {
    // Display the error message in the results section
    document.getElementById("resultOutput").innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

function displayResults(result) {
  const resultContainer = document.getElementById("resultOutput");
  resultContainer.innerHTML = ""; // Clear previous results

  // Loop through the result object and display each key-value pair
  for (const [key, value] of Object.entries(result)) {
    const resultItem = document.createElement("p");
    resultItem.innerHTML = `<strong>${key}:</strong> ${value}`;
    resultContainer.appendChild(resultItem);
  }
}
