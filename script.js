const input = document.getElementById("cityInput");
const title = document.querySelector("#mid-content h1");
const desc = document.querySelector("#mid-content p");
const page = document.getElementById("page1");

const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const weatherDescEl = document.getElementById("weatherDesc");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const weatherIconEl = document.getElementById("weatherIcon");

const apiKey = "bbf1ff7383adb78652400c7f019e31c8"; 


function setDefaultSideContent() {
    cityNameEl.textContent = "🌍 Enter a city";
    weatherIconEl.textContent = "☀️";
    tempEl.textContent = "--°C";
    weatherDescEl.textContent = "Weather info will appear here";
    humidityEl.textContent = "💧 Humidity: --%";
    windEl.textContent = "💨 Wind: -- m/s";
    sunriseEl.textContent = "🌅 Sunrise: --:--";
    sunsetEl.textContent = "🌇 Sunset: --:--";
}
setDefaultSideContent();

input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        const city = input.value.trim();
        if(city !== "") {
            getWeather(city);
            input.value = "";
        }
    }
});


function getWeather(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data); // Debug
            if(data.cod !== 200){
                alert("City not found 😢");
                return;
            }
            updateUI(data);
        })
        .catch(err => {
            console.error(err);
            alert("Something went wrong!");
        });
}


function updateUI(data){
    const weather = data.weather[0].main;
    const description = data.weather[0].description;
    const temp = Math.round(data.main.temp);
    const city = data.name;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const sunrise = new Date(data.sys.sunrise*1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const sunset = new Date(data.sys.sunset*1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const icon = data.weather[0].icon;

    
    title.style.opacity = 0;
    desc.style.opacity = 0;
    setTimeout(()=> {
        title.innerHTML = `${temp}°C`;
        desc.innerHTML = `${weather} in ${city} <br>${description}`;
        title.style.opacity = 1;
        desc.style.opacity = 1;
    }, 200);

    cityNameEl.textContent = city;
    tempEl.textContent = `${temp}°C`;
    weatherDescEl.textContent = `${getWeatherEmoji(weather, temp)} ${description}`;
    humidityEl.textContent = `💧 Humidity: ${humidity}%`;
    windEl.textContent = `💨 Wind: ${windSpeed} m/s`;
    sunriseEl.textContent = `🌅 Sunrise: ${sunrise}`;
    sunsetEl.textContent = `🌇 Sunset: ${sunset}`;
    weatherIconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">`;

    changeBackground(weather, description, temp);
}


function getWeatherEmoji(weather, temp){
    if(temp < 0) return "❄️"; 
    switch(weather){
        case "Clear": return "☀️";
        case "Clouds": return "☁️";
        case "Rain":
        case "Drizzle": return "🌧️";
        case "Thunderstorm": return "⛈️";
        case "Snow": return "❄️";
        default: return "🌫️"; 
    }
}


function changeBackground(weather, description, temp){
    const desc = description.toLowerCase();
    let bgUrl = "";

    if(temp < 0) bgUrl = "https://images.pexels.com/photos/10775316/pexels-photo-10775316.jpeg"; // cold/snow
    else if(weather === "Clear") bgUrl = "https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg";
    else if(weather === "Clouds") bgUrl = "https://images.pexels.com/photos/414659/pexels-photo-414659.jpeg";
    else if(weather === "Rain" || weather === "Drizzle") bgUrl = "https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg";
    else if(weather === "Thunderstorm") bgUrl = "https://images.pexels.com/photos/13032494/pexels-photo-13032494.jpeg";
    else if(weather === "Snow") bgUrl = "https://images.pexels.com/photos/10775316/pexels-photo-10775316.jpeg";
    else if(desc.includes("haze") || desc.includes("mist") || desc.includes("fog") || desc.includes("smoke"))
        bgUrl = "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg";
    else bgUrl = "https://images.pexels.com/photos/13032494/pexels-photo-13032494.jpeg";

    page.style.transition = "background-image 1s ease-in-out";
    page.style.backgroundImage = `url(${bgUrl})`;
}
