const API_KEY = "77030c350908833f98e1fa6f1b3d6374";  // Your working key
const weatherContainer = document.getElementById('weatherContainer');

async function fetchWeather(city) {
  try {
    weatherContainer.innerHTML = '<div class="loading">Loading weather data...</div>';
    
    const currentRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},PK&units=metric&appid=${API_KEY}`
    );
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},PK&units=metric&appid=${API_KEY}`
    );

    displayWeather(currentRes.data, forecastRes.data);
  } catch (error) {
    console.error("Weather API Error:", error.response ? error.response.data : error.message);
    let message = "Error fetching weather data.";
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    weatherContainer.innerHTML = `<div class="loading">${message}</div>`;
  }
}

function displayWeather(current, forecast) {
  const { name, main, weather } = current;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  
  const dailyForecasts = [];
  const forecastList = forecast.list.filter(item => item.dt_txt.includes('12:00:00'));
  for (let i = 0; i < 3; i++) {
    const day = forecastList[i];
    dailyForecasts.push({
      date: new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(day.main.temp),
      icon: day.weather[0].icon
    });
  }

  weatherContainer.innerHTML = `
    <div class="weather-card">
      <div class="weather-main">
        <div>
          <h2>${name}, Pakistan</h2>
          <p>${Math.round(main.temp)}°C, ${weather[0].description}</p>
        </div>
        <img src="${iconUrl}" alt="Weather icon">
      </div>
      <div class="forecast">
        ${dailyForecasts.map(f => `
          <div class="forecast-day">
            <div>${f.date}</div>
            <img src="https://openweathermap.org/img/wn/${f.icon}.png" alt="Forecast icon">
            <div>${f.temp}°C</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function searchCity() {
  const city = document.getElementById('cityInput').value.trim();
  if (city) fetchWeather(city);
}

// Show some default Pakistani cities
['Karachi', 'Lahore', 'Islamabad'].forEach(city => fetchWeather(city));
