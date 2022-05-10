const fs = require("fs");
const readline = require("readline");
const keywords = require("./keywords.json");
const historical = require("./historical.json");
const fileStream = fs.createReadStream(__dirname + "/game.txt");
const lineReader = readline.createInterface({
    input: fileStream,
});
const RawDataManager = require("./RawDataManager.js");
const UserStatsManager = require("./UserStatsManager.js");
const LAST_LINE = "11/28/2021 - 21:31:49: Your server needs to be restarted in order to receive the latest update.";
var KeywordsEnum;
(function (KeywordsEnum) {
    KeywordsEnum["MATCH_STATUS_TEAMS"] = "MATCH_STATUS_TEAMS";
    KeywordsEnum["MATCH_STATUS_ROUNDS"] = "MATCH_STATUS_ROUNDS";
    KeywordsEnum["USER_CONNECT_CT"] = "USER_CONNECT_CT";
    KeywordsEnum["USER_CONNECT_T"] = "USER_CONNECT_T";
    KeywordsEnum["CT_WIN"] = "CT_WIN";
    KeywordsEnum["T_WIN"] = "T_WIN";
    KeywordsEnum["USER_PURCHASED"] = "USER_PURCHASED";
    KeywordsEnum["USER_ATTACKED"] = "USER_ATTACKED";
    KeywordsEnum["USER_KILLED"] = "USER_KILLED";
    KeywordsEnum["USER_ASSISTED"] = "USER_ASSISTED";
    KeywordsEnum["USER_MONEY"] = "USER_MONEY";
    KeywordsEnum["BOMB_DEFUSALS"] = "BOMB_DEFUSALS";
    KeywordsEnum["BOMB_PLANTINGS"] = "BOMB_PLANTINGS";
})(KeywordsEnum || (KeywordsEnum = {}));
const dataManagerInstance = new RawDataManager(false, historical, keywords);
function initialize() {
    if (!(historical.LAST_LINE_READ === LAST_LINE)) {
        let lastLine;
        lineReader.on("line", (line) => {
            lastLine = line;
            for (const key in keywords) {
                if (line.includes(keywords[key])) {
                    dataManagerInstance.buildHistory(key, line, historical, keywords);
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
                constructStats();
            });
        });
    }
    else {
        console.log("File.txt exists");
        constructStats();
    }
}
function constructStats() {
    const usersInitCT = dataManagerInstance.formatUsers(historical[KeywordsEnum.USER_CONNECT_CT]);
    const usersInitT = dataManagerInstance.formatUsers(historical[KeywordsEnum.USER_CONNECT_T]);
    const rounds = dataManagerInstance.formatRounds(historical[KeywordsEnum.MATCH_STATUS_ROUNDS]);
    const userStatsInstance = new UserStatsManager(usersInitCT, usersInitT, dataManagerInstance.formatTeams(historical[KeywordsEnum.MATCH_STATUS_TEAMS]), dataManagerInstance.constructUsersStats(usersInitCT.concat(usersInitT)), dataManagerInstance.formatWins(rounds, historical[KeywordsEnum.T_WIN].concat(historical[KeywordsEnum.CT_WIN])));
    console.log(userStatsInstance);
}
module.exports = initialize;
// module.exports.initialize = initialize;
// module.exports.constructStats = constructStats
//# sourceMappingURL=cli.js.map