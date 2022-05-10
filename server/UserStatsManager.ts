interface TeamI {
    name: string;
    players: string[];
}

module.exports = class UserStatsManager {
    constructor(
        protected initTeamCT: TeamI,
        protected initTeamT: TeamI,
        protected userStatsMain: Record<string, unknown>
    ) {}

    initialize = () => {
        console.log("hi");
    };
};
