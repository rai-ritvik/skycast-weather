const searchbt = document.getElementById("searchbt");
const cityInput = document.getElementById("cityInput");
const cityNameDisplay = document.getElementById("cityName");
const tempDisplay = document.getElementById("temperature");
const statusDisplay = document.getElementById("statusMsg")
const mainIconDisplay = document.getElementById("mainIcon");
const feelsLikeDisplay = document.getElementById("feelsLike");
const humidityDisplay = document.getElementById("humidity");
const windSpeedDisplay = document.getElementById("windSpeed");
const pressureDisplay = document.getElementById("pressure");
const visibilityDisplay = document.getElementById("visibility");
const lastUpdatedDisplay = document.getElementById("lastUpdated");

async function doSearch() {
    const typedCity = cityInput.value;

    try {
        statusDisplay.textContent = "";
        cityNameDisplay.textContent = "";
        tempDisplay.textContent = "";

        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${typedCity}&count=1`);

        const data = await response.json();

        if (!data.results) {
            throw new Error("City not found. Please try again.");
        }

        const lat = data.results[0].latitude;
        const lon = data.results[0].longitude;

        await fetchAndDisplayWeather(lat, lon, data.results[0].name);

    }

    catch (error) {
        console.log("Network error", error);
        statusDisplay.textContent = error.message;
    }
}

searchbt.addEventListener("click", doSearch);

cityInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        doSearch();
    }
});

function getWeatherIcon(weatherCode) {
    if (weatherCode === 0) {
        return "fa-solid fa-sun";
    }
    else if (weatherCode >= 1 && weatherCode <= 3) {
        return "fa-solid fa-cloud";
    }
    else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
        return "fa-solid fa-cloud-rain";
    }
    else if (weatherCode >= 71 && weatherCode <= 86) {
        return "fa-solid fa-snowflake";
    }
    else if (weatherCode >= 95) {
        return "fa-solid fa-bolt";
    }
    else {
        return "fa-solid fa-smog";
    }
}

function getLocalWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Success");
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchAndDisplayWeather(lat, lon, "Your Location");
            },
            (error) => {
                console.log(error)
            }
        );
    }
    else {
        console.log("no GPS");
    }
}

window.addEventListener("load", getLocalWeather);

async function fetchAndDisplayWeather(lat, lon, cityName) {
    try {
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,surface_pressure,visibility,wind_speed_10m,wind_direction_10m`);


        const weatherData = await weatherResponse.json();

        console.log(weatherData);


        cityNameDisplay.textContent = cityName;

        tempDisplay.textContent = `${weatherData.current.temperature_2m} °C`;

        feelsLikeDisplay.textContent = `${weatherData.current.apparent_temperature} °C`;

        humidityDisplay.textContent = `${weatherData.current.relative_humidity_2m}%`;

        windSpeedDisplay.textContent = `${weatherData.current.wind_speed_10m}km/h`;

        pressureDisplay.textContent = `${weatherData.current.surface_pressure}hPa`;

        visibilityDisplay.textContent = `${weatherData.current.visibility / 1000}km`;

        lastUpdatedDisplay.textContent = weatherData.current.time.split("T")[1];

        mainIconDisplay.className = getWeatherIcon(weatherData.current.weather_code);
    }

    catch (error) {
        statusDisplay.textContent = error.message;
    }
}