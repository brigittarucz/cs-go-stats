function getElement(selector) {
    return document.querySelector(selector);
}
class domManipulator {
    constructor(stats) {
        this.stats = stats;
        this.elementSelector = {
            titleTeam1: ".users_team_1 h3",
            titleTeam2: ".users_team_2 h3",
            username: ".header_team_user-name",
            scoreTeam1: ".score_team_1",
            scoreTeam2: ".score_team_2",
            wrapperTeam1: ".users_team_1 .header_team_wrapper",
            wrapperTeam2: ".users_team_2 .header_team_wrapper",
            userTemplate: ".template-user",
            mainSpender: ".main_general_article-spender",
            mainKiller: ".main_general_article-deadliest",
            mainWeapon: ".main_general_article-weapon",
        };
        this.initialize = () => {
            console.log(this.stats);
            this.loadTitle(this.stats.initTeams.CT, getElement(this.elementSelector.titleTeam1));
            this.loadTitle(this.stats.initTeams.T, getElement(this.elementSelector.titleTeam2));
            this.loadPlayers(this.stats.initTeamCT, getElement(this.elementSelector.wrapperTeam1));
            this.loadPlayers(this.stats.initTeamT, getElement(this.elementSelector.wrapperTeam2));
            const deadliestSpender = this.getDeadliestSpender(this.stats.userStatsMain);
            getElement(this.elementSelector.mainSpender).innerHTML =
                deadliestSpender;
        };
        this.loadTitle = (team, titleSelector) => {
            titleSelector.innerHTML = team;
        };
        this.loadPlayers = (users, wrapperSelector) => {
            users.forEach((user) => {
                const template = getElement(this.elementSelector.userTemplate).content.cloneNode(true);
                template.querySelector(this.elementSelector.username).innerHTML =
                    user;
                wrapperSelector.appendChild(template);
            });
        };
        this.getDeadliestSpender = (usersStats) => {
            const spentSums = [];
            for (const user in usersStats) {
                spentSums.push(usersStats[user].moneySpent);
            }
            const maxValue = Math.max(...spentSums);
            let username;
            for (const user in usersStats) {
                console.log(user);
                if (usersStats[user].moneySpent === maxValue) {
                    console.log(user);
                    username = user;
                    return username;
                }
            }
        };
    }
}
(async () => {
    const res = await fetch("http://localhost:3000/getStats");
    const resJson = await res.json();
    const domManipulatorInstance = new domManipulator(resJson.stats);
    domManipulatorInstance.initialize();
})();
//# sourceMappingURL=start.js.map