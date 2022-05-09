const fs = require("fs");
const readline = require("readline");
const keywords = require("./keywords.json");
const historical = require("./historical.json");
const fileStream = fs.createReadStream(__dirname + "/game.txt");
const lineReader = readline.createInterface({
    input: fileStream,
});
const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);
const formatter = {
    USER_CONNECT: (arrLines) => {
        const formattedUsersCt = arrLines.map((line) => {
            // eslint-disable-next-line prettier/prettier
            return line.split("<")[0].split("\"")[1];
        });
        findDuplicates(formattedUsersCt).forEach((duplicateUser) => {
            formattedUsersCt.splice(formattedUsersCt.indexOf(duplicateUser), 1);
        });
        return formattedUsersCt;
    },
};
const LAST_LINE = "11/28/2021 - 21:31:49: Your server needs to be restarted in order to receive the latest update.";
const MATCH_STATUS_TEAMS = "MATCH_STATUS_TEAMS";
if (!(historical.LAST_LINE_READ === LAST_LINE)) {
    let lastLine;
    lineReader.on("line", (line) => {
        lastLine = line;
        for (const key in keywords) {
            if (line.includes(keywords[key])) {
                historical[key].push(line);
                if (historical[MATCH_STATUS_TEAMS].length === 2) {
                    delete keywords[MATCH_STATUS_TEAMS];
                }
                return;
            }
        }
    });
    lineReader.on("close", () => {
        historical.LAST_LINE_READ = lastLine;
        fs.writeFile("./historical.json", JSON.stringify(historical), (err) => {
            if (err) {
                console.log("File writing error", err);
            }
            console.log("File.txt parsed");
            formatHistoricalData();
        });
    });
}
else {
    console.log("File.txt exists");
    formatHistoricalData();
}
function formatHistoricalData() {
    console.log(formatter.USER_CONNECT(historical.USER_CONNECT_CT));
    console.log(formatter.USER_CONNECT(historical.USER_CONNECT_T));
}
//# sourceMappingURL=cli.js.map