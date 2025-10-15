"use strict";

//------------------- API CALLS -----------------------------

// API call for artwork
fetch("https://api.artic.edu/api/v1/artworks/search?q=monet")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return response.json(); // Parse the response as JSON
  })
  .then((artResults) => {
    console.log(artResults); // Do something with the data
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });

// API call for weather
// const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&&start_date=${start_date}&end_date=${end_date}&hourly=temperature_2m`;

const apiUrl =
  "https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2025-09-29&end_date=2025-10-13&hourly=temperature_2m";

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return response.json(); // Parse the response as JSON
  })
  .then((weatherResults) => {
    console.log(weatherResults); // Do something with the data
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
