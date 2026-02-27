// Hide the loading screen after 5 seconds
setTimeout(() => {
    let loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none"; // Hides the loading screen
}, 5000);

// OpenWeatherMap API Key (Replace with your API Key)
const API_KEY = "52ff60c7ca7393ce1fd235caf4dba867";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Function to fetch weather data
function getWeather() {
    let city = document.getElementById("city").value;
    
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    let url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert("City not found! Please try again.");
                return;
            }

            document.getElementById("location").innerText = data.name + ", " + data.sys.country;
            document.getElementById("temperature").innerText = data.main.temp;
            document.getElementById("humidity").innerText = data.main.humidity;
            document.getElementById("wind-speed").innerText = data.wind.speed;
            document.getElementById("pressure").innerText = data.main.pressure;

            // Check if it has rain data
            let rainVolume = data.rain ? data.rain["1h"] : 0;
            document.getElementById("rain").innerText = rainVolume;

            document.getElementById("description").innerText = data.weather[0].description.toUpperCase();
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Error fetching weather data. Please try again.");
        });
}


