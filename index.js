const express = require("express");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");

const api = require("./utils/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/schedules", (req, res, next) => {
    const schedules = api.getAllSchedule(req.query);
    res.send({
        status: "ok",
        data: schedules
    });
});

app.get("/countries", (req, res, next) => {
    const countries = api.getCountry();
    res.send({
        status: "ok",
        data: countries
    });
});

app.get("/athlete", (req, res, next) => {
    const country = req.query.country;

    if (country) {
        const athletesByCountry = api.getAllAthleteByCountry(country);
        res.send({
            status: "ok",
            data: athletesByCountry
        });
    } else {
        const athletes = api.getAllAthlete();
        res.send({
            status: "ok",
            data: athletes
        });
    }
});

app.get("/standings", asyncHandler(async (req, res, next) => {
    const standings = await api.getStandings();
    if (standings) {
        res.send({
            status: "ok",
            data: standings
        });
    } else {
        res.send({
            status: "error"
        });
    }
}));

app.listen(PORT, () => console.log(`asian-games-api listening on port ${PORT}!`));