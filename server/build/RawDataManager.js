var KeywordsEnumDataManager;
(function (KeywordsEnumDataManager) {
    KeywordsEnumDataManager["MATCH_STATUS_TEAMS"] = "MATCH_STATUS_TEAMS";
    KeywordsEnumDataManager["MATCH_STATUS_ROUNDS"] = "MATCH_STATUS_ROUNDS";
    KeywordsEnumDataManager["USER_CONNECT_CT"] = "USER_CONNECT_CT";
    KeywordsEnumDataManager["USER_CONNECT_T"] = "USER_CONNECT_T";
})(KeywordsEnumDataManager || (KeywordsEnumDataManager = {}));
module.exports = class RawDataManager {
    constructor(areTeamsSet) {
        this.areTeamsSet = areTeamsSet;
        this.findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);
        this.buildHistory = function (key, line, historical, keywords) {
            switch (key) {
                case KeywordsEnumDataManager.MATCH_STATUS_ROUNDS: {
                    historical[key].push(line);
                    const rounds = historical[KeywordsEnumDataManager.MATCH_STATUS_ROUNDS];
                    const teams = historical[KeywordsEnumDataManager.MATCH_STATUS_TEAMS];
                    if (!this.areTeamsSet) {
                        if (teams.length === 2 &&
                            rounds[rounds.length - 1].includes("RoundsPlayed: 1")) {
                            this.areTeamsSet = true;
                            delete keywords[KeywordsEnumDataManager.MATCH_STATUS_TEAMS];
                        }
                        else {
                            historical[KeywordsEnumDataManager.MATCH_STATUS_TEAMS] =
                                [];
                        }
                    }
                    break;
                }
                default:
                    historical[key].push(line);
            }
        };
        this.getUserFromString = (line) => {
            return line.split("<")[0].split('"')[1].trim();
        };
        this.formatUsers = function (arrLines) {
            const formattedUsers = arrLines.map((line) => {
                // eslint-disable-next-line prettier/prettier
                return this.getUserFromString(line);
            });
            this.findDuplicates(formattedUsers).forEach((duplicateUser) => {
                formattedUsers.splice(formattedUsers.indexOf(duplicateUser), 1);
            });
            return formattedUsers;
        };
        this.formatTeams = (arrLines) => {
            const formattedTeams = arrLines.map((line) => {
                const arrWords = line.split(":");
                const teamName = arrWords[arrWords.length - 1].trim();
                if (line.includes("CT")) {
                    return {
                        CT: teamName,
                    };
                }
                else {
                    return {
                        T: teamName,
                    };
                }
            });
            return formattedTeams;
        };
        this.formatRounds = (arrRounds) => {
            // TODO: use date type
            const rounds = [];
            arrRounds.forEach((round) => {
                var _a;
                const date = round.slice(0, 21);
                const arrSplitByKeywords = round.split("Score: ")[1].split(" on");
                const score = arrSplitByKeywords[0];
                const roundsPlayed = Number(arrSplitByKeywords[1].split("RoundsPlayed: ")[1]);
                if (roundsPlayed > 0 &&
                    ((_a = rounds[rounds.length - 1]) === null || _a === void 0 ? void 0 : _a.roundsPlayed) !== roundsPlayed) {
                    const round = {
                        date,
                        score,
                        roundsPlayed,
                    };
                    rounds.push(round);
                }
            });
            return rounds;
        };
        this.formatWins = (rounds, wins) => {
            const newRounds = rounds.map((round) => {
                const scoreNumbers = round.score.split(":");
                const winString = `(CT "${scoreNumbers[0]}") (T "${scoreNumbers[1]}")`;
                const foundLine = wins.find((win) => win.includes(winString));
                return Object.assign(Object.assign({}, round), { reasonWin: foundLine.split("triggered")[1].split('"')[1] });
            });
            return newRounds;
        };
        this.constructUsersStats = (arrUsers) => {
            const usersStats = {};
            arrUsers.forEach((user) => {
                const newUserStat = {
                    weapons: {},
                    attacked: {},
                    assistedKilling: {},
                    moneyWon: 0,
                    moneySpent: 0,
                    bombsDefused: 0,
                    bombsPlanted: 0,
                };
                usersStats[user] = newUserStat;
            });
            return usersStats;
        };
    }
};
//# sourceMappingURL=RawDataManager.js.map