// OpenWeatherMap API details
const API_KEY = "52ff60c7ca7393ce1fd235caf4dba867";

// Main function triggered when the "Search" button is clicked
function getWeather() {
    let city = document.getElementById("city").value;
    
    // Stop the code if the user didn't type anything
    if (city === "") return alert("Please enter a city!");

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},KE&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},KE&appid=${API_KEY}&units=metric`;

    // --- 1. Fetch the CURRENT Weather ---
    fetch(currentUrl)
        .then(res => res.json())
        .then(data => {
            if (data.cod != 200) {
                return alert("City not found or API error. Try adding ',KE' to the city name.");
            }
            
            document.getElementById("weather-info").classList.remove("hidden");
            
            document.getElementById("location").innerText = data.name;
            document.getElementById("temperature").innerText = Math.round(data.main.temp);
            document.getElementById("temp-max").innerText = Math.round(data.main.temp_max);
            document.getElementById("temp-min").innerText = Math.round(data.main.temp_min);
            document.getElementById("description").innerText = data.weather[0].description;
            
            // RESTORED: Reconnected the Humidity and Wind stats to the HTML
            document.getElementById("humidity").innerText = data.main.humidity;
            document.getElementById("wind-speed").innerText = data.wind.speed;
            
            // Convert API noun terms to adjectives (Clouds -> Cloudy)
            const weatherTerms = {
                "Clouds": "Cloudy",
                "Clear": "Sunny",
                "Rain": "Rainy",
                "Drizzle": "Drizzly",
                "Snow": "Snowy",
                "Thunderstorm": "Stormy",
                "Mist": "Misty",
                "Fog": "Foggy",
                "Haze": "Hazy"
            };
            
            let rawCondition = data.weather[0].main;
            let displayCondition = weatherTerms[rawCondition] || rawCondition; 
            
            document.getElementById("weather-condition").innerText = displayCondition;

            // Send data to the Activity Guide
            let rainAmt = data.rain ? data.rain['1h'] : 0;
            updateGuide(data.main.temp, rainAmt, data.wind.speed);
        })
        .catch(err => alert("Network error. Please check your internet connection."));

    // --- 2. Fetch the FORECAST Weather (Hourly and Daily) ---
    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            if (!data.list) return; 
            renderHourly(data.list);
            renderDaily(data.list);
        })
        .catch(err => console.error("Forecast failed to load."));
}

// Function to draw the Next 24 Hours timeline
function renderHourly(list) {
    const container = document.getElementById("hourly-container");
    container.innerHTML = ""; 
    
    for (let i = 0; i < 8; i++) {
        const item = list[i];
        if (!item) continue; 
        
        let dateObj = new Date(item.dt * 1000);
        let hours = dateObj.getHours().toString().padStart(2, '0');
        let timeString = `${hours}:00`;

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
    
    for (let i = 8; i < list.length; i += 8) {
        const item = list[i];
        if (!item) continue; 
        
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

    if (rain > 0) adviceHTML += "<p>🚴 <b>Cycling:</b> Wet roads. Reduce speed and brake early.</p>";
    else if (wind > 10) adviceHTML += "<p>🚴 <b>Cycling:</b> Strong headwinds. Expect a tough ride.</p>";
    else adviceHTML += "<p>🚴 <b>Cycling:</b> Great conditions for a ride!</p>";

    document.getElementById("activities-list").innerHTML = adviceHTML;
}
