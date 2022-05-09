const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const corsOptions = {
    origin: "http://127.0.0.1:8080",
};
app.use(cors(corsOptions));
app.get("/start", (req, res) => {
    res.send("Hello World");
});
app.listen(port, () => {
    console.log(`CORS enabled server listening on ${port}`);
});
//# sourceMappingURL=server.js.map