interface TeamI {
    name: string;
    players: string[];
}

interface RoundInterface {
    date: string;
    score: string;
    roundsPlayed: number;
    win?: string;
}

module.exports = class UserStatsManager {
    constructor(
        protected initTeamCT: TeamI,
        protected initTeamT: TeamI,
        protected initTeams: Record<string, unknown>[],
        protected userStatsMain: Record<string, unknown>,
        protected rounds: RoundInterface[]
    ) {}

    initialize = () => {
        console.log("hi");
    };
};
