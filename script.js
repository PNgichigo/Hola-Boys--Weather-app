const API_KEY = "52ff60c7ca7393ce1fd235caf4dba867";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

function getWeather() {
    let city = document.getElementById("city").value;
    if (city === "") return alert("Please enter a city!");

    fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) return alert("City not found!");

            document.getElementById("weather-info").classList.remove("hidden");
            document.getElementById("location").innerText = data.name;
            document.getElementById("temperature").innerText = Math.round(data.main.temp);
            document.getElementById("humidity").innerText = data.main.humidity;
            document.getElementById("wind-speed").innerText = data.wind.speed;
            document.getElementById("pressure").innerText = data.main.pressure;
            document.getElementById("description").innerText = data.weather[0].description;
            document.getElementById("rain").innerText = data.rain ? data.rain["1h"] || 0 : 0;
        })
        .catch(() => alert("Error connecting to weather service."));
}

function createRain() {
    const container = document.getElementById("rain-container");
    for (let i = 0; i < 50; i++) {
        let drop = document.createElement("div");
        drop.className = "raindrop";
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + "s";
        drop.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(drop);
    }
}
createRain();
