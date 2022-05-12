const UserStatsManager = require("./UserStatsManager.js");
const RawDataManager = require("./RawDataManager.js");
const keywords = require("./keywords.json");
const historical = require("./historical.json");
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
const parsedDataManagerInstance = new RawDataManager(false, historical, keywords);
function constructStats() {
    const usersInitCT = parsedDataManagerInstance.formatUsers(historical[KeywordsEnum.USER_CONNECT_CT]);
    const usersInitT = parsedDataManagerInstance.formatUsers(historical[KeywordsEnum.USER_CONNECT_T]);
    const rounds = parsedDataManagerInstance.formatRounds(historical[KeywordsEnum.MATCH_STATUS_ROUNDS]);
    const teams = parsedDataManagerInstance.formatTeams(historical[KeywordsEnum.MATCH_STATUS_TEAMS]);
    const usersStats = parsedDataManagerInstance.constructUsersStats(usersInitCT.concat(usersInitT));
    const wins = parsedDataManagerInstance.formatWins(rounds, historical[KeywordsEnum.T_WIN].concat(historical[KeywordsEnum.CT_WIN]));
    const userStatsInstance = new UserStatsManager(usersInitCT, usersInitT, teams, usersStats, wins);
    userStatsInstance.formatPurchases(historical[KeywordsEnum.USER_PURCHASED]);
    userStatsInstance.formatMoneyMovements(historical[KeywordsEnum.USER_MONEY]);
    userStatsInstance.formatAttacked(historical[KeywordsEnum.USER_ATTACKED]);
    userStatsInstance.formatKilled(historical[KeywordsEnum.USER_KILLED]);
    userStatsInstance.formatAssisted(historical[KeywordsEnum.USER_ASSISTED]);
    userStatsInstance.formatBombsDefused(historical[KeywordsEnum.BOMB_DEFUSALS]);
    userStatsInstance.formatBombsPlanted(historical[KeywordsEnum.BOMB_PLANTINGS]);
    return userStatsInstance.getStats();
}
module.exports = constructStats;
//# sourceMappingURL=DataController.js.map