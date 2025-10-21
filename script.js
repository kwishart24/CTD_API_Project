"use strict";

//------------------- DECLARING VARIABLES -----------------------------
let startDate;
let endDate;
let latitude;
let longitude;
let weatherCode;

//------------------- SUBMIT FORM -----------------------------
const myForm = document.getElementById("myForm");

myForm.addEventListener("submit", function (event) {
  //Prevent page reload
  event.preventDefault();

  //Getting input values from user
  let startDate = event.target.date.value;
  let endDate = event.target.date.value;
  let latitude = event.target.latitude.value;
  let longitude = event.target.longitude.value;
  console.log(startDate, endDate, latitude, longitude);

  //------------------- API CALLS -----------------------------

  //URL for weather API
  const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_min,temperature_2m_max,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`;
  //Example Test Weather API call
  //const apiUrl =
  //   "https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2025-10-04&end_date=2025-10-18&daily=temperature_2m_min,temperature_2m_max,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch";

  // API call for weather

  async function fetchData() {
    try {
      //call from weather API
      const weatherResponse = await fetch(apiUrl);

      if (!weatherResponse.ok) {
        throw new Error("Weather request failed");
      }

      // Parse the response as JSON
      const weatherData = await weatherResponse.json();
      console.log(weatherData);

      // Get weathercode
      const weatherCode = await weatherData.daily.weather_code;
      console.log(weatherCode);

      //Converting weatherCode to weatherCondition
      let weatherCondition = await weatherCode;
      if (weatherCode > 94 && weatherCode < 100) {
        weatherCondition = "lightning";
      } else if (weatherCode > 0 && weatherCode < 4) {
        weatherCondition = "cloudy";
      } else if (weatherCode === 45 || weatherCode === 48) {
        weatherCondition = "foggy";
      } else if (
        (weatherCode > 50 && weatherCode < 68) ||
        (weatherCode > 79 && weatherCode < 83)
      ) {
        weatherCondition = "rain";
      } else if (
        (weatherCode > 70 && weatherCode < 78) ||
        (weatherCode > 84 && weatherCode < 87)
      ) {
        weatherCondition = "snow";
      } else {
        weatherCondition = "sunny";
      }

      //console.log art search word
      console.log(weatherCondition);

      //API call for artwork
      const artResponse = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=${weatherCondition}`
      );

      if (!artResponse.ok) {
        throw new Error("Art request failed");
      }

      const artData = await artResponse.json(); // Parse the response as JSON
      console.log(artData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  //calling the function to run the API calls on form submission
  fetchData();
});
