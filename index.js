import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Body-parser middleware to parse incoming request bodies
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        res.render("index.ejs", {
            weather: null,
        })
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

app.post("/", async (req, res) => {
    try {
        let location = req.body.location;
        location = location.replace(/\s+/g, '+');
        const results = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`);
        let data = results.data;
        let dataResult = data.results[0];
        let latitude = dataResult.latitude;
        let longitude = dataResult.longitude;
        const weather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,rain&timezone=Asia%2FSingapore`);
        console.log(weather);
        // assign weather data to weather
        let weatherData = weather.data;
        let weatherResult = weatherData.current;
        res.render("location.ejs", {
            // pass dri
            name: dataResult.name,
            time: weatherResult.time,
            temperature: weatherResult.temperature_2m,
            precipitation: weatherResult.precipitation,
            rain: weatherResult.rain,
        })
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
