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
        this.formatUsers = function (arrLines) {
            const formattedUsers = arrLines.map((line) => {
                // eslint-disable-next-line prettier/prettier
                return line.split("<")[0].split("\"")[1];
            });
            this.findDuplicates(formattedUsers).forEach((duplicateUser) => {
                formattedUsers.splice(formattedUsers.indexOf(duplicateUser), 1);
            });
            return formattedUsers;
        };
        this.formatTeams = (arrLines) => {
            const formattedTeams = arrLines.map((line) => {
                const arrWords = line.split(":");
                return arrWords[arrWords.length - 1].trim();
            });
            return formattedTeams;
        };
        this.constructUsersStats = (arrUsers) => {
            const usersStats = {};
            arrUsers.forEach((user) => {
                usersStats[user] = {};
            });
            return usersStats;
        };
    }
};
//# sourceMappingURL=DataManager.js.map