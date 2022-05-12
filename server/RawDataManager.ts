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

    getUserFromString = (line: string) => {
        return line.split("<")[0].split('"')[1].trim();
    };

    formatUsers = function (arrLines: string[]) {
        const formattedUsers = arrLines.map((line) => {
            // eslint-disable-next-line prettier/prettier
            return this.getUserFromString(line);
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

    formatRounds = (arrRounds: string[]) => {
        // TODO: use date type
        const rounds: RoundI[] = [];

        arrRounds.forEach((round) => {
            const date = round.slice(0, 21);
            const arrSplitByKeywords = round.split("Score: ")[1].split(" on");
            const score = arrSplitByKeywords[0];
            const roundsPlayed = Number(
                arrSplitByKeywords[1].split("RoundsPlayed: ")[1]
            );

            if (
                roundsPlayed > 0 &&
                rounds[rounds.length - 1]?.roundsPlayed !== roundsPlayed
            ) {
                const round: RoundI = {
                    date,
                    score,
                    roundsPlayed,
                };

                rounds.push(round);
            }
        });

        return rounds;
    };

    formatWins = (rounds: RoundI[], wins: string[]) => {
        const newRounds = rounds.map((round) => {
            const scoreNumbers = round.score.split(":");
            const winString = `(CT "${scoreNumbers[0]}") (T "${scoreNumbers[1]}")`;
            const foundLine = wins.find((win) => win.includes(winString));

            return {
                ...round,
                reasonWin: foundLine.split("triggered")[1].split('"')[1],
            };
        });

        return newRounds;
    };

    constructUsersStats = (arrUsers: string[]) => {
        const usersStats = {};
        arrUsers.forEach((user) => {
            const newUserStat: UserStatisticsI = {
                weapons: {},
                attacked: {},
                killed: {},
                assistedKilling: {},
                moneyWon: 0,
                moneySpent: 0,
                bombsDefused: 0,
                bombsPlanted: 0,
            };

            usersStats[user] = newUserStat;
        });

        return usersStats;
    };
};
