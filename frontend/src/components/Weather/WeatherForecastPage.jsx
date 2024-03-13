import "./Weather.css";
import React, { useEffect, useState } from "react";
import getCurrentLocation from "../utils/geolocation";
import { addDays, format } from "date-fns";
import axios from "axios";
import {
  WiThermometer,
  WiDayCloudy,
  WiUmbrella,
  WiTime3,
} from "react-icons/wi";
import { PiWind } from "react-icons/pi";
import { BsFillSunsetFill, BsFillSunriseFill } from "react-icons/bs";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import OpenWeatherLogo from "../images/OpenWeather-Logo.png";
import { GiSandsOfTime } from "react-icons/gi";

const backendURL = "http://localhost:5000";

// 360度を8分割して、方角を判定する
const convertDegreesToDirection = (degrees) => {
  const directions = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export default function WeatherForecastPage() {
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState([]);
  const [todayForecast, setTodayForecast] = useState([]);
  const [tomorrowForecast, setTomorrowForecast] = useState([]);
  const [twoDaysAfterForecast, setTwoDaysAfterForecast] = useState([]);
  const [threeDaysAfterForecast, setThreeDaysAfterForecast] = useState([]);
  const today = new Date();
  const todayForecastBlocks = [];
  const tomorrowForecastBlocks = [];
  const twoDaysAfterForecastBlocks = [];
  const threeDaysAfterForecastBlocks = [];
  const [selectedForecast, setSelectedForecast] = useState([]);

  // 現在地をWeatherAPIにポストし、天気情報を取得
  const fetchData = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      const { latitude, longitude } = currentLocation;

      // 現在情報、3時間予報取得
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.post(`${backendURL}/weather_current`, { latitude, longitude }),
        axios.post(`${backendURL}/weather_forecast`, { latitude, longitude }),
      ]);

      setCurrentData(currentResponse.data);
      setWeatherData(forecastResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      // データの取得が完了したらローディングステートをfalseに設定→ローディング中画面に使うため
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 現在情報の解析
  useEffect(() => {
    if (currentData) {
      const currentDataList = currentData.data;
      const dateTime = new Date(currentDataList.dt * 1000);
      const hours = dateTime.getHours();
      const min = String(dateTime.getMinutes()).padStart(2, "0");
      const clouds = currentDataList.clouds.all;
      const feelsLike = parseFloat(currentDataList.main.feels_like.toFixed(1));
      const humidity = currentDataList.main.humidity;
      const pressure = currentDataList.main.pressure;
      const temp = parseFloat(currentDataList.main.temp.toFixed(1));
      const tempMax = parseFloat(currentDataList.main.temp_max.toFixed(1));
      const tempMin = parseFloat(currentDataList.main.temp_min.toFixed(1));
      const visibility = currentDataList.visibility / 1000;
      const description = currentDataList.weather[0].description;
      const windDeg = convertDegreesToDirection(currentDataList.wind.deg);
      const windSpeed = parseFloat(currentDataList.wind.speed.toFixed(1));
      const iconCode = currentDataList.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      // 現在情報のブロック構成
      setCurrentWeather(
        <>
          <h3>
            {hours}:{min}　現在の天気
          </h3>
          <div className="current-info">
            <div>
              <img src={iconUrl} alt="Weather Icon" className="weather-icon2" />
              <br />
              <p style={{ fontWeight: "bold" }}>{description}</p>
              <table>
                <tbody>
                  <tr style={{ lineHeight: "2rem" }}>
                    <th>気温</th>
                    <td>{temp}℃</td>
                  </tr>
                  <tr style={{ lineHeight: "2rem" }}>
                    <th>体感</th>
                    <td>{feelsLike}℃</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ paddingLeft: "0.4rem" }}>
              <table>
                <tbody>
                  <tr style={{ lineHeight: "2.5rem" }}>
                    <th>最高</th>
                    <td>{tempMax}℃</td>
                  </tr>
                  <tr style={{ lineHeight: "2.5rem" }}>
                    <th>湿度</th>
                    <td>{humidity}％</td>
                  </tr>
                  <tr style={{ lineHeight: "2.5rem" }}>
                    <th>雲の割合</th>
                    <td>{clouds}％</td>
                  </tr>
                  <tr style={{ lineHeight: "2.5rem" }}>
                    <th>風向</th>
                    <td>{windDeg}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ paddingLeft: "0.4rem" }}>
              <table>
                <tbody>
                  <tr style={{ lineHeight: "2.5rem" }}>
                    <th>最低</th>
                    <td>{tempMin}℃</td>
                  </tr>
                  <tr style={{ lineHeight: "2.5rem" }}>
                    <th>気圧</th>
                    <td>{pressure}hPa</td>
                  </tr>
                  <tr style={{ lineHeight: "2.5rem" }}>
                    <th>視程</th>
                    <td>{visibility}km</td>
                  </tr>
                  <tr style={{ lineHeight: "2.5rem" }}>
                    <th>風速</th>
                    <td>{windSpeed}m/s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
  }, [currentData]);

  // 現在情報の表示を動かす
  const currentWeatherElement = document.querySelector(".current-weather");
  const forecastColumnElement = document.querySelector(".forecast-column");
  if (currentWeatherElement) {
    if (new Date().getHours() >= 12) {
      currentWeatherElement.classList.add("visible");
    }
    if (new Date().getHours() >= 15) {
      currentWeatherElement.classList.add("fifteen");
    }
    if (new Date().getHours() >= 21) {
      currentWeatherElement.classList.remove("fifteen");
      currentWeatherElement.classList.add("nineteen");
      if (forecastColumnElement) {
        forecastColumnElement.classList.add("display-none");
      }
    }
  }

  // 3時間予報40個分を解析
  useEffect(() => {
    if (weatherData) {
      const weatherDataList = weatherData.data.list;

      weatherDataList.forEach(function (data, index) {
        const dateTime = new Date(data.dt * 1000);
        const date = dateTime.getDate();
        const hours = dateTime.getHours();
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const pop = Math.round(data.pop * 100);
        const windDeg = convertDegreesToDirection(data.wind.deg);
        const windSpeed = parseFloat(data.wind.speed.toFixed(1));
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        //3時間予報の各ブロック構成
        const block = (
          <div key={index} className="forecast-block">
            <p>{hours}時</p>
            <p className="description-row" style={{ paddingBottom: "0.3rem" }}>
              <img src={iconUrl} alt="Weather Icon" className="weather-icon2" />
              <br />
              {description}
            </p>
            <p style={{ paddingBottom: "0.3rem" }}>{temperature}℃</p>
            <p style={{ paddingBottom: "0.3rem" }}>{pop}%</p>
            <p>
              {windDeg}
              <br />
              {windSpeed}m/s
            </p>
          </div>
        );
        if (date === today.getDate()) {
          todayForecastBlocks.push(block);
        } else if (date === today.getDate() + 1) {
          tomorrowForecastBlocks.push(block);
        } else if (date === today.getDate() + 2) {
          twoDaysAfterForecastBlocks.push(block);
        } else if (date === today.getDate() + 3) {
          threeDaysAfterForecastBlocks.push(block);
        }
      });
      setTodayForecast(todayForecastBlocks);
      setTomorrowForecast(tomorrowForecastBlocks);
      setTwoDaysAfterForecast(twoDaysAfterForecastBlocks);
      setThreeDaysAfterForecast(threeDaysAfterForecastBlocks);
      setSelectedForecast(tomorrowForecastBlocks);
    }
  }, [weatherData]);

  // 明日以降のボタン選択設定
  const tomorrow = () => {
    setSelectedForecast(tomorrowForecast);
  };
  const twoDaysAfter = () => {
    setSelectedForecast(twoDaysAfterForecast);
  };
  const threeDaysAfter = () => {
    setSelectedForecast(threeDaysAfterForecast);
  };
  const [alignment, setAlignment] = useState("tomorrow");
  const buttonChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  // 日の出・日の入
  const sunriseTimestamp = weatherData?.data.city.sunrise;
  const sunsetTimestamp = weatherData?.data.city.sunset;
  const sunriseDate = new Date(sunriseTimestamp * 1000);
  const sunsetDate = new Date(sunsetTimestamp * 1000);
  const formattedSunriseTime = `${sunriseDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${sunriseDate.getMinutes().toString().padStart(2, "0")}`;
  const formattedSunsetTime = `${sunsetDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${sunsetDate.getMinutes().toString().padStart(2, "0")}`;

  // OpenWeatherAPIの公式ページ
  const openOfficialPage = () => {
    window.open("https://openweathermap.org/", "_blank");
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "1rem" }}>
        <GiSandsOfTime fontSize={"2rem"} />
      </div>
    );
  }

  return (
    <div className="weatherForecastPage">
      <div className="forecast-top">
        <h3 className="city-name">{weatherData?.data.city.name}</h3>
        <div className="current-title">
          <h4>今日</h4>
          <BsFillSunriseFill fontSize={"1.5rem"} className="sun-icon" />
          <p>{formattedSunriseTime}</p>
          <BsFillSunsetFill fontSize={"1.5rem"} className="sun-icon" />
          <p>{formattedSunsetTime}</p>
        </div>
        <img
          src={OpenWeatherLogo}
          alt="OpenWeather Logo"
          style={{ cursor: "pointer" }}
          onClick={openOfficialPage}
        />
      </div>

      <div className="info">
        <div className="today-forecast">
          <div className="forecast-container">
            <div className="forecast-column">
              <p>
                <WiTime3 fontSize={"1.5rem"} />
              </p>
              <p className="widaycloudy">
                <WiDayCloudy fontSize={"1.8rem"} />
              </p>
              <p>
                <WiThermometer fontSize={"1.5rem"} />
              </p>
              <p>
                <WiUmbrella fontSize={"1.5rem"} />
              </p>
              <p>
                <PiWind fontSize={"1.5rem"} />
              </p>
            </div>
            {todayForecast}
          </div>
          <div className="current-weather">{currentWeather}</div>
        </div>

        <div className="afterday-forecast">
          <div className="forecast-title">
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={buttonChange}
              aria-label="Platform"
            >
              <ToggleButton value="tomorrow" onClick={tomorrow}>
                {`明日${format(addDays(today, 1), "MM/dd")}`}
              </ToggleButton>
              <ToggleButton value="twoDaysAfter" onClick={twoDaysAfter}>
                {`明後日${format(addDays(today, 2), "MM/dd")}`}
              </ToggleButton>
              <ToggleButton value="threeDaysAfter" onClick={threeDaysAfter}>
                {`${format(addDays(today, 3), "MM/dd")}`}
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="forecast-container">
            <div className="forecast-column">
              <p>
                <WiTime3 fontSize={"1.5rem"} />
              </p>
              <p className="widaycloudy">
                <WiDayCloudy fontSize={"1.8rem"} />
              </p>
              <p>
                <WiThermometer fontSize={"1.5rem"} />
              </p>
              <p>
                <WiUmbrella fontSize={"1.5rem"} />
              </p>
              <p>
                <PiWind fontSize={"1.5rem"} />
              </p>
            </div>
            {selectedForecast}
          </div>
        </div>
      </div>
    </div>
  );
}
