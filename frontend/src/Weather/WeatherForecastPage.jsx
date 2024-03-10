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

export default function WeatherForecastPage() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
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
      } finally {
        // データの取得が完了したらローディングステートをfalseに設定
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (weatherData) {
      const weatherDataList = weatherData.data.list;

      weatherDataList.forEach(function (data, index) {
        const dateTime = new Date(data.dt * 1000);
        const month = dateTime.getMonth() + 1;
        const date = dateTime.getDate();
        const hours = dateTime.getHours();
        const min = String(dateTime.getMinutes()).padStart(2, "0");
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const pop = Math.round(data.pop * 100);
        function convertDegreesToDirection(degrees) {
          const directions = [
            "北",
            "北東",
            "東",
            "南東",
            "南",
            "南西",
            "西",
            "北西",
          ];

          // 360度を16分割して、方角を判定する
          const index = Math.round(degrees / 45) % 8;

          return directions[index];
        }
        const windDeg = convertDegreesToDirection(data.wind.deg);
        const windSpeed = parseFloat(data.wind.speed.toFixed(1));
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
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

  const tomorrow = () => {
    setSelectedForecast(tomorrowForecast);
  };
  const twoDaysAfter = () => {
    setSelectedForecast(twoDaysAfterForecast);
  };
  const threeDaysAfter = () => {
    setSelectedForecast(threeDaysAfterForecast);
  };

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

  const [alignment, setAlignment] = useState("tomorrow");
  const buttonChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const openOfficialPage = () => {
    window.open("https://openweathermap.org/", "_blank");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "1rem" }}>
        <GiSandsOfTime fontSize={"2rem"} />
      </div>
    ); // ローディング中の表示
  }

  return (
    <div className="weatherForecastPage">
      <div className="forecast-top">
        <h3 className="city-name">{weatherData?.data.city.name}</h3>
        <img
          src={OpenWeatherLogo}
          alt="OpenWeather Logo"
          style={{ cursor: "pointer" }}
          onClick={openOfficialPage}
        />
      </div>

      <div className="info">
        <div className="today-forecast">
          <div className="forecast-title">
            <h4>今日</h4>
            <BsFillSunriseFill fontSize={"1.5rem"} className="sun-icon" />
            <p>{formattedSunriseTime}</p>
            <BsFillSunsetFill fontSize={"1.5rem"} className="sun-icon" />
            <p>{formattedSunsetTime}</p>
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
            {todayForecast}
          </div>
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
