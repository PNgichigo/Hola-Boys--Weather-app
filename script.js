const API_KEY = "52ff60c7ca7393ce1fd235caf4dba867";

function getWeather() {
    let city = document.getElementById("city").value;
    if (city === "") return alert("Please enter a city!");

    // Search specifically in Kenya to fix the "5 degrees" issue
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

            updateGuide(data.main.temp, data.rain ? data.rain['1h'] : 0);
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
    for (let i = 0; i < 4; i++) { // Next 12 hours
        const item = list[i];
        const time = new Date(item.dt * 1000).getHours() + ":00";
        container.innerHTML += `
            <div class="item-box">
                <p>${time}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" width="30">
                <p><b>${Math.round(item.main.temp)}°</b></p>
            </div>`;
    }
}

function renderDaily(list) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    for (let i = 8; i < list.length; i += 8) { // One per day
        const item = list[i];
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        container.innerHTML += `
            <div class="item-box">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" width="30">
                <p><b>${Math.round(item.main.temp)}°</b></p>
            </div>`;
    }
}

function updateGuide(temp, rain) {
    let advice = temp > 32 ? "⚽ Soccer: Dangerous heat. Train in shade." : "⚽ Soccer: Good for practice!";
    if (rain > 0.5) advice = "⚽ Soccer: Slippery pitch. Focus on drills.";
    document.getElementById("activities-list").innerHTML = advice;
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
