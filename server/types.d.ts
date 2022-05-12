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
    totalKills: number;
}
