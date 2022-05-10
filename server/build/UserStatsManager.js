module.exports = class UserStatsManager {
    constructor(initTeamCT, initTeamT, initTeams, userStatsMain, rounds) {
        this.initTeamCT = initTeamCT;
        this.initTeamT = initTeamT;
        this.initTeams = initTeams;
        this.userStatsMain = userStatsMain;
        this.rounds = rounds;
        this.getUserFromString = (line) => {
            return line.split("<")[0].split('"')[1].trim();
        };
        this.getUserStatsMain = () => {
            return this.userStatsMain;
        };
        this.formatPurchases = (historicalPurchases) => {
            historicalPurchases.forEach((line) => {
                const weaponsUser = this.userStatsMain[this.getUserFromString(line)].weapons;
                // eslint-disable-next-line prettier/prettier
                const purchase = line.split("\"")[3];
                purchase in weaponsUser
                    ? weaponsUser[purchase]++
                    : (weaponsUser[purchase] = 1);
            });
        };
    }
};
//# sourceMappingURL=UserStatsManager.js.map