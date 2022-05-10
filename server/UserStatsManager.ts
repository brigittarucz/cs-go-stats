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

interface UserStatisticsI {
    weapons: Record<string, number>;
    attacked: Record<string, AttackedI>;
    assisted: Record<string, unknown>;
    moneyWon: number;
    moneySpent: number;
    bombsDefused: number;
    bombsPlanted: number;
}

module.exports = class UserStatsManager {
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
};
