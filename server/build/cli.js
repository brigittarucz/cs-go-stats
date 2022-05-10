const fs = require("fs");
const readline = require("readline");
const keywords = require("./keywords.json");
const historical = require("./historical.json");
const fileStream = fs.createReadStream(__dirname + "/game.txt");
const lineReader = readline.createInterface({
    input: fileStream,
});
var KeywordsEnum;
(function (KeywordsEnum) {
    KeywordsEnum["MATCH_STATUS_TEAMS"] = "MATCH_STATUS_TEAMS";
    KeywordsEnum["MATCH_STATUS_ROUNDS"] = "MATCH_STATUS_ROUNDS";
})(KeywordsEnum || (KeywordsEnum = {}));
const LAST_LINE = "11/28/2021 - 21:31:49: Your server needs to be restarted in order to receive the latest update.";
const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);
const dataManager = {
    buildHistory: (key, line) => {
        switch (key) {
            case KeywordsEnum.MATCH_STATUS_ROUNDS: {
                historical[key].push(line);
                const rounds = historical[KeywordsEnum.MATCH_STATUS_ROUNDS];
                const teams = historical[KeywordsEnum.MATCH_STATUS_TEAMS];
                if (teams.length === 2 &&
                    rounds[rounds.length - 1].includes("RoundsPlayed: 1 ")) {
                    delete keywords[KeywordsEnum.MATCH_STATUS_TEAMS];
                }
                else {
                    historical[KeywordsEnum.MATCH_STATUS_TEAMS] = [];
                }
                break;
            }
            default:
                historical[key].push(line);
        }
    },
    formatUsers: (arrLines) => {
        const formattedUsers = arrLines.map((line) => {
            // eslint-disable-next-line prettier/prettier
            return line.split("<")[0].split("\"")[1];
        });
        findDuplicates(formattedUsers).forEach((duplicateUser) => {
            formattedUsers.splice(formattedUsers.indexOf(duplicateUser), 1);
        });
        return formattedUsers;
    },
    formatTeams: (arrLines) => {
        const formattedTeams = arrLines.map((line) => {
            const arrWords = line.split(":");
            return arrWords[arrWords.length - 1].trim();
        });
        return formattedTeams;
    },
};
if (!(historical.LAST_LINE_READ === LAST_LINE)) {
    let lastLine;
    lineReader.on("line", (line) => {
        lastLine = line;
        for (const key in keywords) {
            if (line.includes(keywords[key])) {
                dataManager.buildHistory(key, line);
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
    console.log(dataManager.formatUsers(historical.USER_CONNECT_CT));
    console.log(dataManager.formatUsers(historical.USER_CONNECT_T));
}
//# sourceMappingURL=cli.js.map