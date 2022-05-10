interface TeamI {
    name: string;
    players: string[];
}

interface RoundI {
    date: string;
    score: string;
    roundsPlayed: number;
    win?: string;
}

interface WithI {
    weapon: string;
    damage: number;
    hitgroup: string;
}

interface AttackedI {
    times: number;
    with: WithI[];
}

interface KilledI {
    times: number;
    weapons: string[];
    headshots: number;
}

interface UserStatisticsI {
    weapons: Record<string, number>;
    attacked: Record<string, AttackedI>;
    killed: Record<string, KilledI>;
    assistedKilling: Record<string, { times: number }>;
    moneyWon: number;
    moneySpent: number;
    bombsDefused: number;
    bombsPlanted: number;
}

module.exports = class UserStatsManager {
    static excludeKeywords = [
        "func_breakable",
        "prop_dynamic",
        "prop_door_rotating",
    ];

    constructor(
        protected initTeamCT: TeamI,
        protected initTeamT: TeamI,
        protected initTeams: Record<string, unknown>[],
        protected userStatsMain: Record<string, UserStatisticsI>,
        protected rounds: RoundI[]
    ) {}

    getUserFromString = (line: string) => {
        return line.split("<")[0].split('"')[1].trim();
    };

    getUserStatsMain = () => {
        // console.log(this.userStatsMain);
        // console.log(this.initTeamT);
        // console.log(this.initTeamCT);
        return this.userStatsMain;
    };

    formatPurchases = (historicalPurchases: string[]) => {
        historicalPurchases.forEach((line) => {
            const weaponsUser =
                this.userStatsMain[this.getUserFromString(line)].weapons;
            // eslint-disable-next-line prettier/prettier
            const purchase = line.split("\"")[3]
            purchase in weaponsUser
                ? weaponsUser[purchase]++
                : (weaponsUser[purchase] = 1);
        });
    };

    formatMoneyMovements = (historicalMoney: string[]) => {
        historicalMoney.forEach((line) => {
            let isThisSpent: boolean;
            line.includes("+") ? (isThisSpent = false) : (isThisSpent = true);

            const money = isThisSpent
                ? Number(
                      line.split("money change")[1].split("-")[1].split(" ")[0]
                  )
                : Number(line.split("+")[1].split(" ")[0]);

            !isThisSpent &&
                (this.userStatsMain[this.getUserFromString(line)].moneyWon +=
                    money);

            isThisSpent &&
                (this.userStatsMain[this.getUserFromString(line)].moneySpent +=
                    money);
        });
    };

    formatAttacked = (historicalAttacked: string[]) => {
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
            const attackValue = line.split("with")[1].split("\"")

            attacked in attackerAttackHistory &&
                attackerAttackHistory[attacked].times++ &&
                attackerAttackHistory[attacked].with.push({
                    weapon: attackValue[1],
                    damage: Number(attackValue[3]),
                    hitgroup: attackValue[11],
                });
        });
    };

    formatKilled = (historicalKilled: string[]) => {
        historicalKilled.forEach((line) => {
            const killer = this.getUserFromString(line.split("killed")[0]);
            const killed = this.getUserFromString(line.split("killed")[1]);

            const isUserInvalid =
                UserStatsManager.excludeKeywords.find(
                    (kw) => kw === killer || kw === killed
                ) || false;

            if (isUserInvalid) {
                return;
            }

            const weapon = line.split("with")[1].split('"')[1];
            const isItHeadshot = Boolean(line.split("with")[1].split('"')[2]);

            const killerKillHistory = this.userStatsMain[killer].killed;

            !(killed in killerKillHistory) &&
                (killerKillHistory[killed] = {
                    times: 0,
                    weapons: [],
                    headshots: 0,
                });

            killed in killerKillHistory &&
                killerKillHistory[killed].times++ &&
                killerKillHistory[killed].weapons.push(weapon);

            isItHeadshot && killerKillHistory[killed].headshots++;
        });
    };

    formatAssisted = (historicalAssisted: string[]) => {
        historicalAssisted.forEach((line) => {
            const assistee = this.getUserFromString(line.split("assisted")[0]);
            const killedAfterAssist = this.getUserFromString(
                line.split("assisted")[1]
            );

            const assisteeAssistHistory =
                this.userStatsMain[assistee].assistedKilling;

            !(killedAfterAssist in assisteeAssistHistory) &&
                (assisteeAssistHistory[killedAfterAssist] = { times: 0 });

            killedAfterAssist in assisteeAssistHistory &&
                assisteeAssistHistory[killedAfterAssist].times++;
        });
    };

    formatBombsDefused = (historicalDefusals: string[]) => {
        historicalDefusals.forEach((line) => {
            const userDefused = this.getUserFromString(line);
            this.userStatsMain[userDefused].bombsDefused++;
        });
    };

    formatBombsPlanted = (historicalPlantings: string[]) => {
        historicalPlantings.forEach((line) => {
            const userPlanted = this.getUserFromString(line);
            this.userStatsMain[userPlanted].bombsPlanted++;
        });
    };
};
