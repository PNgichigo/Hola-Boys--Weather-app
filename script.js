const API_KEY = "52ff60c7ca7393ce1fd235caf4dba867";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

function getWeather() {
    let city = document.getElementById("city").value;
    if (city === "") return alert("Please enter a city!");

    // Adding ",KE" helps the API find Kenyan locations like Hola or Nanyuki first
    fetch(`${BASE_URL}?q=${city},KE&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) return alert("City not found!");

            const info = document.getElementById("weather-info");
            info.classList.remove("hidden");
            
            // Updating Basic Stats
            document.getElementById("location").innerText = data.name + ", " + data.sys.country;
            document.getElementById("temperature").innerText = Math.round(data.main.temp);
            document.getElementById("description").innerText = data.weather[0].description.toUpperCase();
            document.getElementById("humidity").innerText = data.main.humidity;
            document.getElementById("wind-speed").innerText = data.wind.speed;
            document.getElementById("pressure").innerText = data.main.pressure;
            
            const rain = data.rain ? (data.rain["1h"] || 0) : 0;
            document.getElementById("rain").innerText = rain;

            // Activity Guide Logic
            const temp = Math.round(data.main.temp);
            const wind = data.wind.speed;
            let advice = "";

            if (rain > 0.2) {
                advice += "⚽ <b>Sports:</b> Pitch is wet. Watch for sliding.<br>";
            } else if (temp > 32) {
                advice += "⚽ <b>Sports:</b> Extreme heat. Water breaks every 15 mins.<br>";
            } else {
                advice += "⚽ <b>Sports:</b> Perfect for soccer practice!<br>";
            }

            if (temp < 20) {
                advice += "🏃 <b>Running:</b> Great cool weather for a long run.<br>";
            } else {
                advice += "🏃 <b>Running:</b> It's warm. Take it easy.<br>";
            }

            if (rain > 2) {
                advice += "🚜 <b>Field Work:</b> Good moisture for the soil.<br>";
            } else {
                advice += "🚗 <b>Travel:</b> Clear roads. Safe journey.<br>";
            }

            document.getElementById("activities-list").innerHTML = advice;
        })
        .catch(() => alert("Error connecting to weather service."));
}

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

setTimeout(() => {
    document.getElementById("loading-screen").style.opacity = "0";
    setTimeout(() => { document.getElementById("loading-screen").style.display = "none"; }, 500);
}, 3000);
