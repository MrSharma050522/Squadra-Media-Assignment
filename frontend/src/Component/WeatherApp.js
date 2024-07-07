import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherApp.css";
const WEATHER_API_KEY = "e756bb509c144dec9bc45148240607";

const WeatherApp = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [historicalWeather, setHistoricalWeather] = useState([]);
    const [location, setLocation] = useState("Delhi");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const locations = [
        "Delhi",
        "Moscow",
        "Paris",
        "New York",
        "Sydney",
        "Riyadh",
    ];

    useEffect(() => {
        // Fetch current weather data
        const fetchCurrentWeather = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/current-weather-data?location=${location}`);
                setCurrentWeather(response.data);
            } catch (error) {
                console.error("Error fetching current weather data:", error);
            }
        };

        fetchCurrentWeather();
    }, [location]);

    const fetchHistoricalWeather = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/historical-weather-data?location=${location}&fromDate=${fromDate}&toDate=${toDate}`
            );
            setHistoricalWeather(response.data.forecast.forecastday);
        } catch (error) {
            console.error("Error fetching historical weather data:", error);
            alert("Error fetching historical weather data Greater 30 days")
        }
    };

    return (
        <div className="weather-app">
            <h1>Weather App</h1>

            <div className="card">
                <h2>Current Weather in {location}</h2>
                {currentWeather ? (
                    <div className="weather-info">
                        <p>Temperature: {currentWeather.current.temp_c}°C</p>
                        <p>
                            Condition: {currentWeather.current.condition.text}
                        </p>
                        <img
                            src={currentWeather.current.condition.icon}
                            alt="Weather icon"
                        />
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <div className="card">
                <h2>Historical Weather Data</h2>
                <div className="filters">
                    <label>
                        Location:
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            {locations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        From:
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </label>
                    <label>
                        To:
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </label>
                    <button onClick={fetchHistoricalWeather}>
                        Fetch Historical Data
                    </button>
                </div>

                {historicalWeather.length > 0 ? (
                    <div className="historical-weather">
                        {historicalWeather.map((day) => (
                            <div key={day.date} className="historical-day">
                                <h3>{day.date}</h3>
                                <p>Max Temp: {day.day.maxtemp_c}°C</p>
                                <p>Min Temp: {day.day.mintemp_c}°C</p>
                                <p>Condition: {day.day.condition.text}</p>
                                <img
                                    src={day.day.condition.icon}
                                    alt="Weather icon"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>
                        No historical data available. Please select a valid date
                        range.
                    </p>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;
