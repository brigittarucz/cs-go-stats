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

const LAST_LINE =
    "11/28/2021 - 21:31:49: Your server needs to be restarted in order to receive the latest update.";

enum KeywordsEnum {
    MATCH_STATUS_TEAMS = "MATCH_STATUS_TEAMS",
    MATCH_STATUS_ROUNDS = "MATCH_STATUS_ROUNDS",
    USER_CONNECT_CT = "USER_CONNECT_CT",
    USER_CONNECT_T = "USER_CONNECT_T",
    CT_WIN = "CT_WIN",
    T_WIN = "T_WIN",
    USER_PURCHASED = "USER_PURCHASED",
    USER_ATTACKED = "USER_ATTACKED",
    USER_KILLED = "USER_KILLED",
    USER_ASSISTED = "USER_ASSISTED",
    USER_MONEY = "USER_MONEY",
    BOMB_DEFUSALS = "BOMB_DEFUSALS",
    BOMB_PLANTINGS = "BOMB_PLANTINGS",
}

const dataManagerInstance = new RawDataManager(false, historical, keywords);

interface RoundInterface {
    date: string;
    score: string;
    roundsPlayed: number;
    reasonWin?: string;
}

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
                    }
                    console.log("File.txt parsed");
                    constructStats();
                }
            );
        });
    } else {
        console.log("File.txt exists");
        constructStats();
    }
}

function constructStats() {
    const usersInitCT = dataManagerInstance.formatUsers(
        historical[KeywordsEnum.USER_CONNECT_CT]
    );
    const usersInitT = dataManagerInstance.formatUsers(
        historical[KeywordsEnum.USER_CONNECT_T]
    );
    const rounds: RoundInterface = dataManagerInstance.formatRounds(
        historical[KeywordsEnum.MATCH_STATUS_ROUNDS]
    );
    const userStatsInstance = new UserStatsManager(
        usersInitCT,
        usersInitT,
        dataManagerInstance.formatTeams(
            historical[KeywordsEnum.MATCH_STATUS_TEAMS]
        ),
        dataManagerInstance.constructUsersStats(usersInitCT.concat(usersInitT)),
        dataManagerInstance.formatWins(
            rounds,
            historical[KeywordsEnum.T_WIN].concat(
                historical[KeywordsEnum.CT_WIN]
            )
        )
    );

    userStatsInstance.formatPurchases(historical[KeywordsEnum.USER_PURCHASED]);
    userStatsInstance.formatMoneyMovements(historical[KeywordsEnum.USER_MONEY]);
    userStatsInstance.formatAttacked(historical[KeywordsEnum.USER_ATTACKED]);
    userStatsInstance.formatAssisted(historical[KeywordsEnum.USER_ASSISTED]);

    console.log(userStatsInstance.getUserStatsMain().electronic.assisted);
}

module.exports = initialize;

// module.exports.initialize = initialize;
// module.exports.constructStats = constructStats
