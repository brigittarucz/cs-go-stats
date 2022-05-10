enum KeywordsEnumDataManager {
    MATCH_STATUS_TEAMS = "MATCH_STATUS_TEAMS",
    MATCH_STATUS_ROUNDS = "MATCH_STATUS_ROUNDS",
    USER_CONNECT_CT = "USER_CONNECT_CT",
    USER_CONNECT_T = "USER_CONNECT_T",
}

module.exports = class RawDataManager {
    constructor(protected areTeamsSet: boolean) {}

    findDuplicates = (arr: unknown[]) =>
        arr.filter(
            (item: unknown, index: number) => arr.indexOf(item) != index
        );

    buildHistory = function (
        key: string,
        line: string,
        historical: Record<string, string[]>,
        keywords: Record<string, string>
    ) {
        switch (key) {
            case KeywordsEnumDataManager.MATCH_STATUS_ROUNDS: {
                historical[key].push(line);

                const rounds =
                    historical[KeywordsEnumDataManager.MATCH_STATUS_ROUNDS];
                const teams =
                    historical[KeywordsEnumDataManager.MATCH_STATUS_TEAMS];

                if (!this.areTeamsSet) {
                    if (
                        teams.length === 2 &&
                        rounds[rounds.length - 1].includes("RoundsPlayed: 1")
                    ) {
                        this.areTeamsSet = true;
                        delete keywords[
                            KeywordsEnumDataManager.MATCH_STATUS_TEAMS
                        ];
                    } else {
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

    formatUsers = function (arrLines: string[]) {
        const formattedUsers = arrLines.map((line) => {
            // eslint-disable-next-line prettier/prettier
            return line.split("<")[0].split("\"")[1];
        });

        this.findDuplicates(formattedUsers).forEach((duplicateUser: string) => {
            formattedUsers.splice(formattedUsers.indexOf(duplicateUser), 1);
        });

        return formattedUsers;
    };

    formatTeams = (arrLines: string[]) => {
        const formattedTeams = arrLines.map((line) => {
            const arrWords = line.split(":");
            const teamName = arrWords[arrWords.length - 1].trim();
            if (line.includes("CT")) {
                return {
                    CT: teamName,
                };
            } else {
                return {
                    T: teamName,
                };
            }
        });

        return formattedTeams;
    };

    constructUsersStats = (arrUsers: string[]) => {
        const usersStats = {};
        arrUsers.forEach((user) => {
            usersStats[user] = {};
        });

        return usersStats;
    };
};
