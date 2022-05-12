function getElement(selector) {
    return document.querySelector(selector);
}
class domManipulator {
    constructor(private stats) {}

    elementSelector = {
        titleTeam1: ".users_team_1 h3",
        titleTeam2: ".users_team_2 h3",
        username: ".header_team_user-name",
        scoreTeam1: ".score_team_1",
        scoreTeam2: ".score_team_2",
        wrapperTeam1: ".users_team_1 .header_team_wrapper",
        wrapperTeam2: ".users_team_2 .header_team_wrapper",
        userTemplate: ".template_user",
        userTemplateRow: ".template_user_row",
        trKills: ".tr_kills",
        trUsername: ".tr_username",
        trPlanted: ".tr_planted",
        trDefused: ".tr_defused",
        trAssists: ".tr_assists",
        trWeapons: ".tr_weapons",
        mainSpender: ".main_general_article-spender",
        mainKiller: ".main_general_article-deadliest",
        mainWeapon: ".main_general_article-weapon",
        scoreboardTeam1: ".scoreboard_team_1 tbody",
        scoreboardTeam2: ".scoreboard_team_2 tbody",
    };

    initialize = () => {
        console.log(this.stats);
        this.loadTitle(
            this.stats.initTeams.CT,
            getElement(this.elementSelector.titleTeam1)
        );
        this.loadTitle(
            this.stats.initTeams.T,
            getElement(this.elementSelector.titleTeam2)
        );
        this.loadPlayers(
            this.stats.initTeamCT,
            getElement(this.elementSelector.wrapperTeam1)
        );
        this.loadPlayers(
            this.stats.initTeamT,
            getElement(this.elementSelector.wrapperTeam2)
        );

        const deadliestSpender = this.getDeadliestSpender(
            this.stats.userStatsMain
        );

        getElement(this.elementSelector.mainSpender).innerHTML =
            deadliestSpender;

        const deadliestUser = this.getDeadliestUser(this.stats.userStatsMain);

        getElement(this.elementSelector.mainKiller).innerHTML = deadliestUser;

        this.stats.initTeamCT.forEach((user) => {
            this.loadUsersScoreboard(
                this.stats.userStatsMain[user],
                user,
                getElement(this.elementSelector.scoreboardTeam1)
            );
        });

        this.stats.initTeamT.forEach((user) => {
            this.loadUsersScoreboard(
                this.stats.userStatsMain[user],
                user,
                getElement(this.elementSelector.scoreboardTeam2)
            );
        });

        const scoreTeam1 =
            this.stats.rounds[this.stats.rounds.length - 1].score.split(":")[1];

        const scoreTeam2 =
            this.stats.rounds[this.stats.rounds.length - 1].score.split(":")[0];

        getElement(this.elementSelector.scoreTeam1).innerHTML = scoreTeam1;
        getElement(this.elementSelector.scoreTeam2).innerHTML = scoreTeam2;
    };

    loadTitle = (team: string, titleSelector: HTMLElement) => {
        titleSelector.innerHTML = team;
    };

    loadPlayers = (users: string[], wrapperSelector: HTMLElement) => {
        users.forEach((user) => {
            const template = getElement(
                this.elementSelector.userTemplate
            ).content.cloneNode(true);
            template.querySelector(this.elementSelector.username).innerHTML =
                user;
            wrapperSelector.appendChild(template);
        });
    };

    getDeadliestSpender = (usersStats) => {
        const spentSums: number[] = [];
        for (const user in usersStats) {
            spentSums.push(usersStats[user].moneySpent);
        }

        const maxValue = Math.max(...spentSums);
        let username: string;

        for (const user in usersStats) {
            if (usersStats[user].moneySpent === maxValue) {
                username = user;
                return username;
            }
        }
    };

    getDeadliestUser = (usersStats) => {
        const killings: number[] = [];
        for (const user in usersStats) {
            killings.push(usersStats[user].totalKills);
        }
        const maxValue = Math.max(...killings);

        for (const user in usersStats) {
            if (usersStats[user].totalKills === maxValue) {
                return user;
            }
        }
    };

    loadUsersScoreboard = (user, username, wrapperSelector) => {
        const template = getElement(
            this.elementSelector.userTemplateRow
        ).content.cloneNode(true);
        template.querySelector(this.elementSelector.trUsername).innerHTML =
            username;
        template.querySelector(this.elementSelector.trKills).innerHTML =
            user.totalKills;
        template.querySelector(this.elementSelector.trDefused).innerHTML =
            user.bombsDefused;
        template.querySelector(this.elementSelector.trPlanted).innerHTML =
            user.bombsPlanted;

        let assists = 0;

        for (const userKilledThroughAssist in user.assistedKilling) {
            assists += user.assistedKilling[userKilledThroughAssist].times;
        }

        template.querySelector(this.elementSelector.trAssists).innerHTML =
            assists;

        let weapons = "";

        for (const weapon in user.weapons) {
            weapons += weapon + " | ";
        }

        template.querySelector(this.elementSelector.trWeapons).innerHTML =
            weapons;

        wrapperSelector.appendChild(template);
    };
}

(async () => {
    const res = await fetch("http://localhost:3000/getStats");
    const resJson = await res.json();

    const domManipulatorInstance = new domManipulator(resJson.stats);
    domManipulatorInstance.initialize();
})();
