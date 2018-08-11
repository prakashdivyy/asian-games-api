const express = require("express");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");

const api = require("./utils/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/schedules", asyncHandler(async (req, res, next) => {
    let { sport, lang } = req.query;
    const schedules = await api.getAllSchedule(sport, lang ? lang : "id");
    if (schedules) {
        res.send({
            status: "ok",
            data: schedules
        });
    } else {
        res.sendStatus(404);
    }
}));

app.listen(PORT, () => console.log(`asian-games-api listening on port ${PORT}!`));