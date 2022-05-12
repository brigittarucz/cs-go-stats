const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const constructStatsUsers = require("./DataController.js");
app.use(bodyParser.json());

const corsOptions = {
    origin: "http://127.0.0.1:8080",
};

app.use(cors(corsOptions));

app.get("/getStats", (req, res) => {
    res.send({ stats: constructStatsUsers() });
});

app.listen(port, () => {
    console.log(`CORS enabled server listening on ${port}`);
});

// TODO: create README obj look
// TODO: types file
// TODO: clear console logs
