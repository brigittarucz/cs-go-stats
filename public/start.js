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
        };
        this.loadTitle = (team, titleSelector) => {
            console.log(team);
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
    }
}
(async () => {
    const res = await fetch("http://localhost:3000/getStats");
    const resJson = await res.json();
    const domManipulatorInstance = new domManipulator(resJson.stats);
    domManipulatorInstance.initialize();
    // const template = getElement("#template-matrix").content.cloneNode(true);
    //     for (let i = 1; i <= Math.pow(size, 2); i++) {
    //         const div = document.createElement("div");
    //         div.className = `${i}-matrix-cell`;
    //         template.querySelector("#container-matrix").appendChild(div);
    //     }
    //     for (let i = 1; i <= size; i++) {
    //         for (let j = 1; j <= size; j++) {
    //             this.multidimensionPositionalArray.push([j, i]);
    //         }
    //     }
    //     node.appendChild(template);
})();
//# sourceMappingURL=start.js.map