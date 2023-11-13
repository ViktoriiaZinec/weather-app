"use strict";

const API_KEY = "0f1581161aa123427d4fa63078351e30";

const form = document.querySelector(".search");
const input = form.querySelector(".search_bar");
const btn = document.querySelector(".btn-submit");
const locationBtn = document.querySelector(".location-btn");

function updateWeatherUI(data) {
  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, feels_like, humidity, pressure } = data.main;
  const { speed } = data.wind;
  const { sunrise, sunset } = data.sys;

  document.querySelector(".city").innerText = `${name}`;

  const iconElement = document.querySelector(".icon");

  const iconMappings = {
    "01d": "./images/1clear_sky.png",
    "02d": "./images/2few_clouds.png",
    "03d": "./images/3scattered_clouds.png",
    "04d": "./images/4broken_clouds.png",
    "09d": "./images/5shower_rain.png",
    "10d": "./images/6rain.png",
    "11d": "./images/7thunderstorm.png",
    "13d": "./images/8snow.png",
    "50d": "./images/9fog.png",
    "01n": "./images/1-2clear_sky.png",
    "02n": "./images/2-2few_clouds.png",
    "03n": "./images/3scattered_clouds.png",
    "04n": "./images/4broken_clouds.png",
    "09n": "./images/5shower_rain.png",
    "10n": "./images/6-2rain.png",
    "11n": "./images/7thunderstorm.png",
    "13n": "./images/8-2snow.png",
    "50n": "./images/9fog.png",
  };
  const customIcon = iconMappings[icon] || "default-icon";

  iconElement.src = customIcon;
  iconElement.style.width = "150px";
  iconElement.style.height = "150px";

  document.querySelector(".description").innerText = description;
  document.querySelector(".temp").innerText = `${Math.round(temp)}°C`;
  document.querySelector(".feels-like").innerText = ` ${Math.round(
    feels_like
  )}°C`;
  document.querySelector(".humidity").innerText = `${humidity}%`;
  document.querySelector(".wind").innerText = `${speed} km/h`;
  document.querySelector(".pressure").innerText = `${Math.round(pressure)}hPa`;

  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);

  function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const formattedSunrise = formatTime(sunriseDate);
  const formattedSunset = formatTime(sunsetDate);

  document.querySelector(".sunrise").innerText = ` ${formattedSunrise} AM`;
  document.querySelector(".sunset").innerText = ` ${formattedSunset} AM`;
  document.querySelector("#sunrise").innerText = ` ${formattedSunrise} AM`;
  document.querySelector("#sunset").innerText = ` ${formattedSunset} AM`;

  const { hours, mins, day, number, month } = getDate();
  document.querySelector(".time").innerText = `${hours} : ${mins}`;
  document.querySelector(".date").innerText = `${day}, ${number} ${month}`;

  //convert to hours
  const timezoneOffset = data.timezone / 60;

  const currentTimeUTC = new Date();
  const currentOffset = currentTimeUTC.getTimezoneOffset();

  // alculate the difference between the obtained offset and the expected offset
  const timezoneDifference = currentOffset + timezoneOffset;

  // add the difference to the current UTC time
  const localTime = new Date(
    currentTimeUTC.getTime() + timezoneDifference * 60 * 1000
  );

  const localHours = localTime.getHours().toString().padStart(2, "0");
  const localMins = localTime.getMinutes().toString().padStart(2, "0");

  document.querySelector(".time").innerText = `${localHours} : ${localMins}`;
}

async function fetchWeather(input) {
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
  const endpoint = `${BASE_URL}?q=${input}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      updateWeatherUI(data);
      return data;
    } else {
      document.querySelector(
        ".error"
      ).innerText = `Location not found, please try again.`;
      throw new Error(`Error HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

fetchWeather("Kyiv");

btn.addEventListener("click", async function (event) {
  event.preventDefault();
  const inputValue = input.value.trim();

  document.querySelector(".error").innerText = "";
  if (!inputValue) {
    document.querySelector(".error").innerText = "Please enter a location.";
    return;
  }
  await fetchWeather(inputValue);

  input.value = "";
});

const getLocation = async () => {
  const BASE_GEO_URL = `https://api.openweathermap.org/data/2.5/weather`;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(
        `${BASE_GEO_URL}?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => {
          updateWeatherUI(data);
          return data;
        });
    });
  }
};

locationBtn.addEventListener("click", () => getLocation());

const getDate = () => {
  let date = new Date();

  let n = date.getDay();

  n = n === 0 ? 6 : n - 1;

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let day = days[n];

  let number = date.getDate();

  let nMonth = date.getMonth();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let month = months[nMonth];

  return { day, number, month };
};
