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
        this.formatMoneyMovements = (historicalMoney) => {
            historicalMoney.forEach((line) => {
                let isThisSpent;
                line.includes("+") ? (isThisSpent = false) : (isThisSpent = true);
                const money = isThisSpent
                    ? Number(line.split("money change")[1].split("-")[1].split(" ")[0])
                    : Number(line.split("+")[1].split(" ")[0]);
                !isThisSpent &&
                    (this.userStatsMain[this.getUserFromString(line)].moneyWon +=
                        money);
                isThisSpent &&
                    (this.userStatsMain[this.getUserFromString(line)].moneySpent +=
                        money);
            });
        };
        this.formatAttacked = (historicalAttacked) => {
            historicalAttacked.forEach((line) => {
                const attacker = this.getUserFromString(line.split("attacked")[0]);
                const attacked = this.getUserFromString(line.split("attacked")[1]);
                const attackerAttackHistory = this.userStatsMain[attacker].attacked;
                !(attacked in attackerAttackHistory) &&
                    (attackerAttackHistory[attacked] = {
                        times: 0,
                        with: [],
                    });
                // eslint-disable-next-line prettier/prettier
                const attackValue = line.split("with")[1].split("\"");
                attacked in attackerAttackHistory &&
                    attackerAttackHistory[attacked].times++ &&
                    attackerAttackHistory[attacked].with.push({
                        weapon: attackValue[1],
                        damage: Number(attackValue[3]),
                        hitgroup: attackValue[11],
                    });
            });
        };
        this.formatAssisted = (historicalAssisted) => {
            historicalAssisted.forEach((line) => {
                const assistee = this.getUserFromString(line.split("assisted")[0]);
                const killedAfterAssist = this.getUserFromString(line.split("assisted")[1]);
                const assisteeAssistHistory = this.userStatsMain[assistee].assisted;
                !(killedAfterAssist in assisteeAssistHistory) &&
                    (assisteeAssistHistory[killedAfterAssist] = { times: 0 });
                killedAfterAssist in assisteeAssistHistory &&
                    assisteeAssistHistory[killedAfterAssist].times++;
            });
        };
    }
};
//# sourceMappingURL=UserStatsManager.js.map