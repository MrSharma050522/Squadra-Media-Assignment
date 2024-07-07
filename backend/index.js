const express = require("express");
const app = express();
const axios =  require("axios");
const cors = require("cors");
const port = 8080;
const WEATHER_API_KEY = "e756bb509c144dec9bc45148240607";

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

// Basic route
app.get("/", (req, res) => {
    res.send("Hello From Backend");
});

app.get("/current-weather-data", async (req, res) => {
    try {
        const {location} = req.query;
        const response = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error -> ", error);
        res.status(400).json(error);
    }
})

app.get("/historical-weather-data", async (req, res) => {
    try {
        const {location, fromDate, toDate} = req.query;
        // Parse the dates
        const from = new Date(fromDate);
        const to = new Date(toDate);

        // Calculate the difference in days
        const diffTime = Math.abs(to - from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
            return res.status(400).json({ error: 'Cannot get data for more than 30 days.' });
        }
        const response = await axios.get(
            `https://api.weatherapi.com/v1/history.json?key=${WEATHER_API_KEY}&q=${location}&dt=${fromDate}&end_dt=${toDate}`
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error -> ", error);
        res.status(400).json(error);
    }
})



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
