(() => {
    const fs = require("fs");
    const readline = require("readline");

    const keywords = require("./keywords.json");
    const historical = require("./historical.json");

    const fileStream = fs.createReadStream(__dirname + "/game.txt");
    const lineReader = readline.createInterface({
        input: fileStream,
    });

    const RawDataManager = require("./RawDataManager.js");
    const LAST_LINE =
        "11/28/2021 - 21:31:49: Your server needs to be restarted in order to receive the latest update.";

    const dataManagerInstance = new RawDataManager(false, historical, keywords);

    function initialize() {
        if (!(historical.LAST_LINE_READ === LAST_LINE)) {
            let lastLine: string;
            lineReader.on("line", (line) => {
                lastLine = line;

                for (const key in keywords) {
                    if (line.includes(keywords[key])) {
                        dataManagerInstance.buildHistory(
                            key,
                            line,
                            historical,
                            keywords
                        );
                        return;
                    }
                }
            });

            lineReader.on("close", () => {
                historical.LAST_LINE_READ = lastLine;
                fs.writeFile(
                    "./historical.json",
                    JSON.stringify(historical),
                    (err) => {
                        if (err) {
                            console.log("File writing error", err);
                            return 0;
                        }
                        console.log("File.txt parsed");
                        return 1;
                    }
                );
            });

            lineReader.on("error", (err) => {
                console.log("LineReader", err);
                return 0;
            });
        } else {
            console.log("File.txt exists");
            return 1;
        }
    }

    initialize();
})();
