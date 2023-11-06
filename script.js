"use strict";

const API_KEY = "0f1581161aa123427d4fa63078351e30";

const form = document.querySelector(".search");
const input = form.querySelector(".search_bar");
const btn = document.querySelector("button");
const locationBtn = document.querySelector(".location-button");

btn.addEventListener("click", async function (event) {
  event.preventDefault();
  const inputValue = input.value.trim();
  await fetchWeather(inputValue);
  input.value = "";
});

async function fetchWeather(input) {
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
  const endpoint = `${BASE_URL}?q=${input}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;

      document.querySelector(".city").innerText = `Weather in: ${name}`;
      document.querySelector(
        ".icon"
      ).src = `https://openweathermap.org/img/wn/${icon}.png`;

      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = `${Math.round(temp)} °C`;
      document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
      document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;

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
          const { name } = data;
          const { icon, description } = data.weather[0];
          const { temp, feels_like, humidity } = data.main;
          const { speed } = data.wind;

          document.querySelector(".city").innerText = `Weather in: ${name}`;
          document.querySelector(
            ".icon"
          ).src = `https://openweathermap.org/img/wn/${icon}.png`;

          document.querySelector(".description").innerText = description;
          document.querySelector(".temp").innerText = `${Math.round(temp)} °C`;
          document.querySelector(
            ".humidity"
          ).innerText = `Humidity: ${humidity}%`;
          document.querySelector(
            ".wind"
          ).innerText = `Wind speed: ${speed} km/h`;

          return data;
        });
    });
  }
};

locationBtn.addEventListener("click", () => getLocation());
