const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const initializeDataProcessing = require("./cli");

app.use(bodyParser.json());

const corsOptions = {
    origin: "http://127.0.0.1:8080",
};

app.use(cors(corsOptions));

app.get("/start", (req, res) => {
    // TODO: differentiate storage between data in stats obj and raw data processing
    initializeDataProcessing();
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`CORS enabled server listening on ${port}`);
});
