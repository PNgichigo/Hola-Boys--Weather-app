const API_KEY = "52ff60c7ca7393ce1fd235caf4dba867";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

function getWeather() {
    let city = document.getElementById("city").value;
    if (city === "") return alert("Please enter a city!");

    fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) return alert("City not found!");

            const info = document.getElementById("weather-info");
            info.classList.remove("hidden");
            
            // Rounding and Updating Basic Stats
            document.getElementById("location").innerText = data.name;
            document.getElementById("temperature").innerText = Math.round(data.main.temp);
            document.getElementById("description").innerText = data.weather[0].description;
            document.getElementById("humidity").innerText = data.main.humidity;
            document.getElementById("wind-speed").innerText = data.wind.speed;
            document.getElementById("pressure").innerText = data.main.pressure;
            
            const rain = data.rain ? (data.rain["1h"] || 0) : 0;
            document.getElementById("rain").innerText = rain;

            // Activity Guide Logic
            const temp = Math.round(data.main.temp);
            const wind = data.wind.speed;
            let advice = "";

            // Sports/Soccer Logic
            if (rain > 0.2) {
                advice += "⚽ <b>Sports:</b> Pitch is wet. Use caution.<br>";
            } else if (temp > 32) {
                advice += "⚽ <b>Sports:</b> Very hot. Reduce training intensity.<br>";
            } else {
                advice += "⚽ <b>Sports:</b> Great weather for a match!<br>";
            }

            // Field Work/Running
            if (temp < 20) {
                advice += "🏃 <b>Running:</b> Cool air. Perfect for long runs.<br>";
            } else {
                advice += "🏃 <b>Running:</b> Warm. Stay hydrated.<br>";
            }

            // Travel/Field Work
            if (rain > 5 || wind > 18) {
                advice += "🚗 <b>Travel:</b> Warning! Low visibility/high wind.<br>";
            } else {
                advice += "🚜 <b>Field Work:</b> Conditions are clear for work.<br>";
            }

            document.getElementById("activities-list").innerHTML = advice;
        })
        .catch(() => alert("Error connecting to weather service."));
}

// Background Rain Effect
function createRain() {
    const container = document.getElementById("rain-container");
    for (let i = 0; i < 40; i++) {
        let drop = document.createElement("div");
        drop.className = "raindrop";
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 0.8 + 0.5) + "s";
        drop.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(drop);
    }
}
createRain();

// Hide loading screen helper
setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";
}, 4500);
