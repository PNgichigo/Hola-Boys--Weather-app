// OpenWeatherMap API details
const API_KEY = "52ff60c7ca7393ce1fd235caf4dba867";

// Main function triggered when the "Search" button is clicked
function getWeather() {
    let city = document.getElementById("city").value;
    
    // Stop the code if the user didn't type anything
    if (city === "") return alert("Please enter a city!");

    // We use two different API endpoints: one for right now, one for the future forecasts
    // Adding ',KE' forces the search to look in Kenya first (fixing the cold temperature bug)
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},KE&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},KE&appid=${API_KEY}&units=metric`;

    // --- 1. Fetch the CURRENT Weather ---
    fetch(currentUrl)
        .then(res => res.json()) // Convert the response to JSON data
        .then(data => {
            // Error handling if the city doesn't exist
            if (data.cod !== 200) return alert("City not found in Kenya. Try adding ',KE'");
            
            // Un-hide the weather card now that we have data
            document.getElementById("weather-info").classList.remove("hidden");
            
            // Map the API data to the HTML elements
            // Math.round() removes the ugly decimals (e.g., turns 24.32 into 24)
            document.getElementById("location").innerText = data.name;
            document.getElementById("temperature").innerText = Math.round(data.main.temp);
            document.getElementById("temp-max").innerText = Math.round(data.main.temp_max);
            document.getElementById("temp-min").innerText = Math.round(data.main.temp_min);
            document.getElementById("description").innerText = data.weather[0].description;
            document.getElementById("humidity").innerText = data.main.humidity;
            
            // NEW ADDITION: Injects the main weather condition (e.g., Rain, Clouds, Clear) into the new middle card
            document.getElementById("weather-condition").innerText = data.weather[0].main;
            
            document.getElementById("wind-speed").innerText = data.wind.speed;

            // Check if it's raining (the API only sends 'rain' data if it is actually raining)
            let rainAmt = data.rain ? data.rain['1h'] : 0;
            
            // Send the data to our custom Activity Guide logic
            updateGuide(data.main.temp, rainAmt, data.wind.speed);
        });

    // --- 2. Fetch the FORECAST Weather (Hourly and Daily) ---
    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            // Pass the giant list of forecast data to our render functions
            renderHourly(data.list);
            renderDaily(data.list);
        });
}

// Function to draw the Next 24 Hours timeline
function renderHourly(list) {
    const container = document.getElementById("hourly-container");
    container.innerHTML = ""; // Clear out old data
    
    // Loop through the first 8 items in the list (The API provides data every 3 hours. 8 * 3 = 24 hours)
    for (let i = 0; i < 8; i++) {
        const item = list[i];
        
        // Convert the UNIX timestamp into a readable 24-hour time format (e.g., "15:00")
        let dateObj = new Date(item.dt * 1000);
        let hours = dateObj.getHours().toString().padStart(2, '0');
        let timeString = `${hours}:00`;

        // Create the HTML for each individual hour block and add it to the container
        // Note: @2x.png requests higher resolution icons from OpenWeatherMap
        container.innerHTML += `
            <div class="item-box">
                <p>${timeString}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather icon">
                <p><b>${Math.round(item.main.temp)}°</b></p>
            </div>`;
    }
}

// Function to draw the 4-Day Forecast
function renderDaily(list) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    
    // We skip 8 items at a time so we only get one forecast reading per day (since 8 items = 24 hours)
    for (let i = 8; i < list.length; i += 8) {
        const item = list[i];
        
        // Get the short name of the weekday (e.g., "Mon", "Tue")
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        
        container.innerHTML += `
            <div class="item-box">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather icon">
                <p><b>${Math.round(item.main.temp)}°</b></p>
            </div>`;
    }
}

// Function containing the custom logic for school/outdoor activities
function updateGuide(temp, rain, wind) {
    let adviceHTML = "";

    // If/Else statements checking conditions and adding advice to the list
    if (rain > 0.5) adviceHTML += "<p>⚽ <b>Soccer:</b> Slippery pitch. Focus on drills.</p>";
    else if (temp > 32) adviceHTML += "<p>⚽ <b>Soccer:</b> Dangerous heat. Train in shade.</p>";
    else adviceHTML += "<p>⚽ <b>Soccer:</b> Perfect for practice!</p>";

    if (rain > 0) adviceHTML += "<p>⛺ <b>Camping:</b> Wet conditions. Ensure your tent is waterproof.</p>";
    else if (temp < 15) adviceHTML += "<p>⛺ <b>Camping:</b> Chilly night ahead. Pack extra blankets.</p>";
    else adviceHTML += "<p>⛺ <b>Camping:</b> Great clear weather for pitching a tent.</p>";

    if (rain > 0) adviceHTML += "<p>🥾 <b>Hiking:</b> Trails will be muddy and slippery.</p>";
    else if (temp > 30) adviceHTML += "<p>🥾 <b>Hiking:</b> Very hot. Carry extra water and go early.</p>";
    else adviceHTML += "<p>🥾 <b>Hiking:</b> Excellent trail conditions!</p>";

    if (rain > 0) adviceHTML += "<p>⛳ <b>Golf:</b> Greens are wet. Play might be slow.</p>";
    else if (wind > 8) adviceHTML += "<p>⛳ <b>Golf:</b> Windy! You'll need to adjust your swings.</p>";
    else adviceHTML += "<p>⛳ <b>Golf:</b> Perfect day for a full 18 holes.</p>";

    if (rain > 0) adviceHTML += "<p>🚴 <b>Cycling
        
