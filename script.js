const searchbt = document.getElementById("searchbt");
const cityInput = document.getElementById("cityInput");
const cityNameDisplay = document.getElementById("cityName");
const tempDisplay = document.getElementById("temperature");
const statusDisplay = document.getElementById("statusMsg")

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

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const weatherData = await weatherResponse.json();

        console.log(data);
        console.log(weatherData);

        const foundCity = data.results[0].name;
        const temperature = weatherData.current_weather.temperature;
        cityNameDisplay.textContent = foundCity;
        tempDisplay.textContent = temperature + " °C";
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