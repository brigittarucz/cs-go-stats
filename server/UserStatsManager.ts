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

interface UserStatisticsI {
    weapons: Record<string, number>;
    attacked: Record<string, unknown>;
    assisted: Record<string, unknown>;
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
};
