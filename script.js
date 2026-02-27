const API_KEY = "52ff60c7ca7393ce1fd235caf4dba867";

function getWeather() {
    let city = document.getElementById("city").value;
    if (city === "") return alert("Please enter a city!");

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},KE&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},KE&appid=${API_KEY}&units=metric`;

    // Fetch Current Data
    fetch(currentUrl)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) return alert("City not found in Kenya. Try adding ',KE'");
            
            document.getElementById("weather-info").classList.remove("hidden");
            document.getElementById("location").innerText = data.name;
            document.getElementById("temperature").innerText = Math.round(data.main.temp);
            document.getElementById("temp-max").innerText = Math.round(data.main.temp_max);
            document.getElementById("temp-min").innerText = Math.round(data.main.temp_min);
            document.getElementById("description").innerText = data.weather[0].description;
            document.getElementById("humidity").innerText = data.main.humidity;
            document.getElementById("wind-speed").innerText = data.wind.speed;

            let rainAmt = data.rain ? data.rain['1h'] : 0;
            updateGuide(data.main.temp, rainAmt, data.wind.speed);
        });

    // Fetch Forecast Data
    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            renderHourly(data.list);
            renderDaily(data.list);
        });
}

function renderHourly(list) {
    const container = document.getElementById("hourly-container");
    container.innerHTML = "";
    
    // Grabs the next 8 available forecast slots (24 hours)
    for (let i = 0; i < 8; i++) {
        const item = list[i];
        
        // Formats time to strictly 24-hour style (e.g., 12:00, 15:00)
        let dateObj = new Date(item.dt * 1000);
        let hours = dateObj.getHours().toString().padStart(2, '0');
        let timeString = `${hours}:00`;

        // Layout: Time on top, Icon in middle, Temp at bottom
        container.innerHTML += `
            <div class="item-box">
                <p>${timeString}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather icon">
                <p><b>${Math.round(item.main.temp)}°</b></p>
            </div>`;
    }
}

function renderDaily(list) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    
    for (let i = 8; i < list.length; i += 8) {
        const item = list[i];
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        container.innerHTML += `
            <div class="item-box">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather icon">
                <p><b>${Math.round(item.main.temp)}°</b></p>
            </div>`;
    }
}

function updateGuide(temp, rain, wind) {
    let adviceHTML = "";

    // Soccer
    if (rain > 0.5) adviceHTML += "<p>⚽ <b>Soccer:</b> Slippery pitch. Focus on drills.</p>";
    else if (temp > 32) adviceHTML += "<p>⚽ <b>Soccer:</b> Dangerous heat. Train in shade.</p>";
    else adviceHTML += "<p>⚽ <b>Soccer:</b> Perfect for practice!</p>";

    // Camping
    if (rain > 0) adviceHTML += "<p>⛺ <b>Camping:</b> Wet conditions. Ensure your tent is waterproof.</p>";
    else if (temp < 15) adviceHTML += "<p>⛺ <b>Camping:</b> Chilly night ahead. Pack extra blankets.</p>";
    else adviceHTML += "<p>⛺ <b>Camping:</b> Great clear weather for pitching a tent.</p>";

    // Hiking
    if (rain > 0) adviceHTML += "<p>🥾 <b>Hiking:</b> Trails will be muddy and slippery.</p>";
    else if (temp > 30) adviceHTML += "<p>🥾 <b>Hiking:</b> Very hot. Carry extra water and go early.</p>";
    else adviceHTML += "<p>🥾 <b>Hiking:</b> Excellent trail conditions!</p>";

    // Golf
    if (rain > 0) adviceHTML += "<p>⛳ <b>Golf:</b> Greens are wet. Play might be slow.</p>";
    else if (wind > 8) adviceHTML += "<p>⛳ <b>Golf:</b> Windy! You'll need to adjust your swings.</p>";
    else adviceHTML += "<p>⛳ <b>Golf:</b> Perfect day for a full 18 holes.</p>";

    // Cycling
    if (rain > 0) adviceHTML += "<p>🚴 <b>Cycling:</b> Roads are slick. Ride with caution.</p>";
    else if (wind > 10) adviceHTML += "<p>🚴 <b>Cycling:</b> Tough headwinds expected today.</p>";
    else adviceHTML += "<p>🚴 <b>Cycling:</b> Great day for a long ride.</p>";

    // Gardening
    if (rain > 1) adviceHTML += "<p>🌱 <b>Gardening:</b> Nature is doing the watering today!</p>";
    else if (temp > 30) adviceHTML += "<p>🌱 <b>Gardening:</b> Water plants early morning or late evening.</p>";
    else adviceHTML += "<p>🌱 <b>Gardening:</b> Excellent weather to be out in the garden.</p>";

    document.getElementById("activities-list").innerHTML = adviceHTML;
}

// Background Rain
function createRain() {
    const container = document.getElementById("rain-container");
    for (let i = 0; i < 30; i++) {
        let drop = document.createElement("div");
        drop.className = "raindrop";
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + "s";
        container.appendChild(drop);
    }
}
createRain();
