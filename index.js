const API_KEY = 'da81db15eb9d8f5943d7b3cd225a0fe1';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const errorMessage = document.getElementById('error-message');
const weatherContainer = document.getElementById('weather-container');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city === '') {
        displayError('Please enter a city name.');
        return;
    }
    fetchWeatherData(city);
});


function displayError(message) {
    errorMessage.textContent = message;
    weatherContainer.style.display = 'none';
}


async function fetchWeatherData(city) {
    try {
        errorMessage.textContent = '';

        const currentWeatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric
`
        );
        console.log(currentWeatherResponse.ok)
        if (!currentWeatherResponse.ok) {
            throw new Error('City not found.');
        }
        const currentWeatherData = await currentWeatherResponse.json();

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!forecastResponse.ok) {
            throw new Error('Forecast data not available.');
        }
        const forecastData = await forecastResponse.json();

        updateCurrentWeather(currentWeatherData);
        updateForecast(forecastData);
        weatherContainer.style.display = 'block';
    } catch (error) {
        displayError(error.message);
    }
}

function updateCurrentWeather(data) {
    const {
        name,
        main,
        weather
    } = data;
    const temperature = main.temp;
    const description = weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    currentWeatherDiv.innerHTML = `
        <h2>${name}</h2>
        <img src="${icon}" alt="${description}">
        <p><strong>${temperature}°C</strong></p>
        <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    `;
}


function updateForecast(data) {
    const forecastList = data.list;
    const dailyForecast = {};

    forecastList.forEach(item => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString(undefined, {
            weekday: 'long'
        });
        if (!dailyForecast[day] && date.getHours() === 12) {
            dailyForecast[day] = item;
        }
    });

    forecastDiv.innerHTML = '';

    for (let day in dailyForecast) {
        const forecast = dailyForecast[day];
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        const forecastHTML = `
            <div class="forecast-day">
                <h3>${day}</h3>
                <img src="${icon}" alt="${description}">
                <p><strong>${temperature}°C</strong></p>
                <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            </div>
        `;
        forecastDiv.insertAdjacentHTML('beforeend', forecastHTML);
    }
}

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});
