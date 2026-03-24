const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("result");

button.addEventListener("click", async function () {
    const city = input.value.trim();
    if (city === "") {
        result.innerHTML = "Введите город";
        return;
    }

    result.innerHTML = "Загрузка...";

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru&format=json`
        );
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            result.innerHTML = "Город не найден";
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;
        const name = geoData.results[0].name;
        const country = geoData.results[0].country;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        const temp = weatherData.current.temperature_2m;
        const feelsLike = weatherData.current.apparent_temperature;
        const humidity = weatherData.current.relative_humidity_2m;
        const wind = weatherData.current.wind_speed_10m;
        const time = new Date(weatherData.current.time).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});

        const tempColor = temp > 0 ? "#ff8c00" : "#007bff";

        result.innerHTML = `
            <div class="card" style="border-top: 5px solid ${tempColor}">
                <h2 style="color: ${tempColor}">${name}, ${country}</h2>
                <p><strong>Координаты:</strong> ${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
                <p><strong>Температура:</strong> ${temp}°C (ощущается как ${feelsLike}°C)</p>
                <p><strong>Влажность:</strong> ${humidity}%</p>
                <p><strong>Ветер:</strong> ${wind} км/ч</p>
                <hr>
                <p><small>Последнее обновление: ${time}</small></p>
            </div>
        `;
    } catch (error) {
        result.innerHTML = "Ошибка: запустите через Live Server";
        console.error(error);
    }
});
