const Weather = class {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeather = undefined;
        this.forecast = undefined;
        this.resultBlockSelector = "#result";
        this.resultsBlock = document.querySelector(this.resultBlockSelector);
    };

    getCurrWeather(value) {
        let url = this.currentWeatherLink.replace("{query}", value);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            this.draw();
        });
        req.send();
    }
    getForecast(value) {
        let url = this.forecastLink.replace("{query}", value);
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            this.forecast = data.list;
            this.draw();
        });
    }

    getWeather(value) {
        // maybe better solution its make promises of these two functions instead drawing twice?
        this.getCurrWeather(value);
        this.getForecast(value);
    }

    createBlock(dateString, temp, feelsLikeTemp, iconName, description) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = "block";

        let dateBlock = document.createElement("div");
        dateBlock.className = "date";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);

        let tempBlock = document.createElement("div");
        tempBlock.className = "temp";
        tempBlock.innerHTML = `${temp} &deg;C`;
        weatherBlock.appendChild(tempBlock);

        let feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.className = "feels-like";
        feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemp} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "icon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        let weatherDescription = document.createElement("div");
        weatherDescription.className = "description";
        weatherDescription.innerText = description;
        weatherBlock.appendChild(weatherDescription);
        weatherBlock.className = "block";
        return weatherBlock;
    }
    clear() {
        this.resultsBlock.innerHTML = '';
    }
    draw() {
        this.clear();
        let currentBlock = document.createElement("div");
        currentBlock.id = "current";
        //currentBlock.className = "block";
        this.resultsBlock.appendChild(currentBlock);
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

            const temperature = this.currentWeather.main.temp;
            const feelsLikeTemperature = this.currentWeather.main.feels_like;
            const iconName = this.currentWeather.weather[0].icon;
            const description = this.currentWeather.weather[0].description;

            const weatherBlock = this.createBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
            currentBlock.appendChild(weatherBlock);
        }

        let forecastBlock = document.createElement("div");
        forecastBlock.id = "forecast";
        this.resultsBlock.appendChild(forecastBlock);
        if (this.forecast && this.forecast.length > 0) {
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
                const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

                const temperature = weather.main.temp;
                const feelsLikeTemperature = weather.main.feels_like;
                const iconName = weather.weather[0].icon;
                const description = weather.weather[0].description;

                const weatherBlock = this.createBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
                forecastBlock.appendChild(weatherBlock);
            }
        }
    }
}
const API_KEY = "b33f7f7630b82ed4a240bd62ceb28fda";
let weatherApp = new Weather(API_KEY);
document.querySelector("#getWeatherButton").addEventListener("click", function() {
    const query = document.querySelector("#location").value;
    weatherApp.getWeather(query);
});