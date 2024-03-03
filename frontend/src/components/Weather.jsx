import React, { useEffect, useState } from "react";
import getCurrentLocation from "../utils/geolocation";
import axios from "axios";
const backendURL = "http://localhost:5000";

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const location = await getCurrentLocation();
        const latitude = location.latitude;
        const longitude = location.longitude;
        console.log("Sending request with Latitude:", latitude);
        console.log("Sending request with Longitude:", longitude);

        const response = await axios.post(`${backendURL}/weather`, {
          latitude,
          longitude,
        });

        const weatherData = response.data;
        setWeatherData(weatherData);
        console.log(weatherData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>Current Latitude:</div>
      <div>Current Longitude:</div>
      <div>city:</div>
      <div>Temperature: </div>
      <div>Description: </div>
    </div>
  );
}
