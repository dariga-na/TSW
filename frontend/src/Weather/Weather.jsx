import React, { useEffect, useState } from "react";
import getCurrentLocation from "../utils/geolocation";
import axios from "axios";

const backendURL = "http://localhost:5000";

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentLocation = await getCurrentLocation();
        const latitude = currentLocation.latitude;
        const longitude = currentLocation.longitude;
        const response = await axios.post(`${backendURL}/weather`, {
          latitude,
          longitude,
        });
        const weatherData = response.data;
        setWeatherData(weatherData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  const weatherDataList = weatherData.data.list;

  const dateTime = new Date(weatherDataList[0].dt * 1000);
  const month = dateTime.getMonth() + 1;
  const date = dateTime.getDate();
  const hours = dateTime.getHours();
  const min = String(dateTime.getMinutes()).padStart(2, "0");
  const temperature = Math.round(weatherDataList[0].main.temp);
  const description = weatherDataList[0].weather[0].description;
  const iconCode = weatherDataList[0].weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  // weatherData.data.list.forEach(function (forecast, index) {
  //   console.log(`日時：${month}/${date} ${hours}:${min}`);
  //   console.log(`気温：${temperature}`);
  //   console.log(`天気：${description}`);
  //   console.log(`画像パス：${iconPath}`);
  // });
  const weatherForecasts = weatherDataList
    .slice(0, 5)
    .map((forecast, index) => {
      const dateTime = new Date(forecast.dt * 1000);
      const hours = dateTime.getHours();
      const min = String(dateTime.getMinutes()).padStart(2, "0");
      const temperature = Math.round(forecast.main.temp);
      const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      return (
        <div key={index} className="forecast">
          <div className="forecast-bar">
            <p className="time">
              {hours}:{min}
            </p>
            <p className="temp">{temperature}℃</p>
          </div>
          <img src={iconUrl} alt="Weather Icon" className="weather-icon" />
        </div>
      );
    });

  return (
    <>
      {/* <div>{weatherData.data.city.name}の天気</div>
      <div className="time-container">
        <div className="time-bar">
          <div>
            日時：{month}/{date} {hours}:{min}
          </div>
          <div>気温：{temperature}℃</div>
        </div>
        <div className="weather-icon">画像パス:{iconPath}</div>
      </div>
      <div>天気:{description}</div> */}

      <p className="city-name">{weatherData.data.city.name}</p>
      {weatherForecasts}
    </>
  );
}
