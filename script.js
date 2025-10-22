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

  //------------------- ASYNC/AWAIT FUNCTION FOR WEATHER AND ART API -----------------------------
  async function fetchData() {
    try {
      // API call for weather
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

      //Grabbing max temp
      const tempMax = await weatherData.daily.temperature_2m_max[0];
      console.log(tempMax);

      //Grabbing min temp
      const tempMin = await weatherData.daily.temperature_2m_min[0];
      console.log(tempMin);

      //Converting weatherCode to weatherCondition
      let weatherCondition = await weatherCode;
      if (weatherCode > 94 && weatherCode < 100) {
        weatherCondition = "lightning";
      } else if (weatherCode > 0 && weatherCode < 4) {
        weatherCondition = "cloudy";
      } else if (weatherCode === 45 || weatherCode === 48) {
        weatherCondition = "fog";
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
        weatherCondition = "sun";
      }

      //console.log art search word
      console.log(weatherCondition);

      //Example API call using query
      // const artResponse = await fetch(
      //   // `https://api.artic.edu/api/v1/artworks/search?q=${weatherCondition}`
      //   "https://api.artic.edu/api/v1/images/search?q=rain"
      // );

      //Determining artAPI Url
      let artApi = await weatherCondition;
      if (weatherCondition === "cloudy") {
        artApi = "https://api.artic.edu/api/v1/artworks/20684";
      } else if (weatherCondition === "rain") {
        artApi = "https://api.artic.edu/api/v1/artworks/3279";
      } else if (weatherCondition === "fog") {
        artApi = "https://api.artic.edu/api/v1/artworks/185760";
      } else if (weatherCondition === "sun") {
        artApi = "https://api.artic.edu/api/v1/artworks/94841";
      } else if (weatherCondition === "snow") {
        artApi = "https://api.artic.edu/api/v1/artworks/72801";
      } else if (weatherCondition === "lightning") {
        artApi = "https://api.artic.edu/api/v1/artworks/148390";
      }

      //API call for artwork
      const artResponse = await fetch(artApi);

      if (!artResponse.ok) {
        throw new Error("Art request failed");
      }

      //Getting the art response and turning into JSON
      const artData = await artResponse.json(); // Parse the response as JSON
      console.log(artData); // console.log the JSON

      //getting art json data, grabbing the image url and id from it
      const iiifImageUrl = await artData.config.iiif_url;
      const imageId = await artData.data.image_id;
      console.log(iiifImageUrl);
      console.log(imageId);

      //appending image id, image url, and image properties
      const imageProperty = "/full/843,/0/default.jpg";
      let imageUrl = iiifImageUrl + "/" + imageId + imageProperty;
      console.log(imageUrl);

      //getting artwork date info from JSON results
      const artworkDate = await artData.data.date_display;
      console.log(artworkDate);

      //getting artwork title info from JSON results
      const artworkTitle = await artData.data.title;
      console.log(artworkTitle);

      //getting artwork description info from JSON results
      const artworkDescription = await artData.data.description;
      console.log(artworkDescription);

      //getting artist info from JSON results
      const artist = await artData.data.artist_display;
      console.log(artist);

      //------------------- DISPLAYING WEATHER DATA -----------------------------

      //------------------- WEATHER SECTION -----------------------------

      //Grabbing weather data div
      const weatherDataSection = document.getElementById("weatherData");

      //Grab h2 elements
      const weatherTitle = weatherDataSection.querySelector("h2");
      console.log(weatherTitle);

      if (weatherTitle === null) {
        //Creating H2 for weather data section
        const weatherDataHeader = document.createElement("h2");
        weatherDataHeader.innerText = "Historical Weather Data";
        weatherDataHeader.className = "dataHeader";
        //Appending h2 title to weather data div
        weatherDataSection.appendChild(weatherDataHeader);
        //Creating p for weather data display
        const weatherDataDisplay = document.createElement("p");
        weatherDataDisplay.className = "dataDisplay";
        //Adding weather data to display
        weatherDataDisplay.innerHTML =
          (await "High: ") +
          tempMax +
          "&#176;F<br>Low: " +
          " " +
          tempMin +
          "&#176;F<br>Weather Condition: " +
          weatherCondition.charAt(0).toUpperCase() +
          weatherCondition.slice(1);
        //Appending p to weather data div
        weatherDataSection.appendChild(weatherDataDisplay);
      } else {
        //Grabbing weather data div
        const weatherDataSection = document.getElementById("weatherData");
        //Removing existing data
        weatherDataSection.querySelector("h2").remove();
        weatherDataSection.querySelector("p").remove();

        //Creating new H2 for weather data section
        const weatherDataHeader = document.createElement("h2");
        weatherDataHeader.innerText = "Historical Weather Data";
        weatherDataHeader.className = "dataHeader";
        //Appending new h2 title to weather data div
        weatherDataSection.appendChild(weatherDataHeader);
        //Creating new p for weather data display
        const weatherDataDisplay = document.createElement("p");
        weatherDataDisplay.className = "dataDisplay";
        //Adding new weather data to display
        weatherDataDisplay.innerHTML =
          (await "High: ") +
          tempMax +
          "&#176;F<br>Low: " +
          " " +
          tempMin +
          "&#176;F<br>Weather Condition: " +
          weatherCondition.charAt(0).toUpperCase() +
          weatherCondition.slice(1);
        //Appending new p to weather data div
        weatherDataSection.appendChild(weatherDataDisplay);
      }

      //------------------- DISPLAY ART IMAGE AND INFO -----------------------------
      //------------------- ART IMAGE & HEADER-----------------------------

      //Grabbing art grid div
      const artworkSection = document.getElementById("art-grid");
      //Grab h2 elements
      const artSectionTitle = artworkSection.querySelector("h2");
      console.log(artSectionTitle);

      if (artSectionTitle === null) {
        //Creating H2 for artwork section
        const artworkGridHeader = document.createElement("h2");
        artworkGridHeader.innerText = "Historical Artwork";
        artworkGridHeader.className = "dataHeader";

        //Appending h2 title to art grid div
        artworkSection.prepend(artworkGridHeader);

        //Grabbing artwork div
        const artworkImageSection = document.getElementById("artwork");

        //Creating img tag
        const artworkImage = document.createElement("img");
        artworkImage.src = await imageUrl;
        artworkGridHeader.className = "artImage";

        //Append image to artwork div
        artworkImageSection.appendChild(artworkImage);

        //------------------- ART INFO-----------------------------
        //Grabbing art info div
        const artInfoSection = document.getElementById("artInfo");

        //Create p element for artwork info
        const artInfoDescription = document.createElement("p");
        artInfoDescription.innerHTML =
          (await "Title: ") +
          artworkTitle +
          "<br><br>Date: " +
          " " +
          artworkDate +
          "<br><br>Artist: " +
          artist +
          "<br><br>Description: " +
          " " +
          artworkDescription.replace(
            /(<p[^>]+?>|<p>|<\/p>|<em[^>]+?>|<em>|<\/em>)/gim,
            ""
          );

        artInfoDescription.className = "artworkDataInfo";
        artInfoDescription.className = "artworkDataInfo";

        //Append the artwork data to art info div
        artInfoSection.appendChild(artInfoDescription);

        // //Grab p element
        // const artInfoDescription = artInfoSection.querySelector("p");
        // console.log(artInfoDescription);
      } else {
        //Grabbing art grid div
        const artworkSection = document.getElementById("art-grid");
        //Removing existing art info
        artworkSection.querySelector("h2").remove();
        artworkSection.querySelector("img").remove();

        //Creating H2 for artwork section
        const artworkGridHeader = document.createElement("h2");
        artworkGridHeader.innerText = "Historical Artwork";
        artworkGridHeader.className = "dataHeader";

        //Appending h2 title to art grid div
        artworkSection.prepend(artworkGridHeader);

        //Grabbing artwork div
        const artworkImageSection = document.getElementById("artwork");

        //Creating img tag
        const artworkImage = document.createElement("img");
        artworkImage.src = await imageUrl;
        artworkGridHeader.className = "artImage";

        //Append image to artwork div
        artworkImageSection.appendChild(artworkImage);

        //------------------- ART INFO-----------------------------
        //Grabbing art info div
        const artInfoSection = document.getElementById("artInfo");
        //Removing existing art info
        artInfoSection.querySelector("p").remove();

        //Create p element for artwork info
        const artInfoDescription = document.createElement("p");
        artInfoDescription.innerHTML =
          (await "Title: ") +
          artworkTitle +
          "<br><br>Date: " +
          " " +
          artworkDate +
          "<br><br>Artist: " +
          artist +
          "<br><br>Description: " +
          " " +
          artworkDescription.replace(
            /(<p[^>]+?>|<p>|<\/p>|<em[^>]+?>|<em>|<\/em>)/gim,
            ""
          );

        artInfoDescription.className = "artworkDataInfo";

        //Append the artwork data to art info div
        artInfoSection.appendChild(artInfoDescription);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  //calling the function to run the API calls on form submission
  fetchData();
});
