const apiKey = "YOUR_API_KEY";

const weatherDiv = document.getElementById("weatherdata");

async function fetchWeather(city) {
    weatherDiv.textContent = "Loading...";

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&mode=xml&APPID=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        const xmlText = await response.text();
        showWeather(xmlText);
    } catch (error) {
        const message = document.documentElement.lang === "fi"
            ? "Säätietojen haku epäonnistui."
            : "Fetching the weather data failed.";

        weatherDiv.textContent = message + " (" + error.message + ")";
    }
}

function showWeather(xmlText) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const cityName = xml.querySelector("city").getAttribute("name");
    const temp = xml.querySelector("temperature").getAttribute("value");
    const humidity = xml.querySelector("humidity").getAttribute("value");
    const clouds = xml.querySelector("clouds").getAttribute("name");

    weatherDiv.innerHTML = `
        <h3>${cityName}</h3>
        <p>Temperature: ${temp} °C</p>
        <p>Humidity: ${humidity} %</p>
        <p>Clouds: ${clouds}</p>
    `;
}

document.getElementById("fetchWeather").addEventListener("click", () => {
    fetchWeather("Helsinki");
});

document.getElementById("city").addEventListener("change", (e) => {
    fetchWeather(e.target.value);
});

document.getElementById("search").addEventListener("click", () => {
    const searchWord = document.getElementById("citysearch").value.trim();

    if (searchWord) {
        fetchWeather(searchWord);
    } else {
        weatherDiv.textContent = "Type a city name first.";
    }
});