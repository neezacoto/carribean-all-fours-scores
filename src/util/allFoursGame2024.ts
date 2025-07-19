type TeamEntry = {
    team: Team;
    bullsEye: number;
    hangJacks: number;
};

export class Game {
    teamA: TeamEntry;
    teamB: TeamEntry;
    start: string;
    end: string;
    constructor(teamA: TeamEntry, teamB: TeamEntry, start: string, end: string) {
        this.teamA = teamA;
        this.teamB = teamB;
        this.start = start;
        this.end = end;

        teamA.team.addBullsEyes(teamA.bullsEye, teamB.bullsEye);
        teamA.team.addHangJacks(teamA.hangJacks, teamB.hangJacks);

        teamB.team.addBullsEyes(teamB.bullsEye, teamA.bullsEye);
        teamB.team.addHangJacks(teamB.hangJacks, teamA.hangJacks);
    }
}

class Team {
    name: string;
    bullsEyeWins: number;
    bullsEyeLosses: number;
    hangJackWins: number;
    hangJackLosses: number;
    wins: number;

    constructor(name: string) {
        // Initialize properties here
        this.name = name;
        this.bullsEyeWins = 0;
        this.bullsEyeLosses = 0;
        this.hangJackWins = 0;
        this.hangJackLosses = 0;
        this.wins = 0;
    }

    public addBullsEyes(won: number, lost: number) {
        if(won === 17) this.wins++;
        this.bullsEyeWins += won;
        this.bullsEyeLosses += lost;
        
    }

    public addHangJacks(won: number, lost: number) {
        this.hangJackWins += won;
        this.hangJackLosses += lost;
    }
}

class Division {
    name: string;
    teams: Team[];

    constructor(name: string) {
        this.name = name;
        this.teams = [];
    }

    public addTeam(team: Team) {
        this.teams.push(team);
    }
}

type Round = 1 | 2 | 3;

export class Tournament {
    roundOne: Game[];
    roundTwo: Game[];
    roundThree: Game[];
    divisions: Division[];

    constructor() {
        this.roundOne = [];
        this.roundTwo = [];
        this.roundThree = [];
        this.divisions = [];
    }

    public addDivision(division: Division) {
        this.divisions.push(division);
    }

    public getDivisions() {
        return this.divisions;
    }

    public getGames() {
        return [this.roundOne, this.roundTwo, this.roundThree];
    }

    public findTeam(teamName: string): Team | undefined {
        for (const division of this.divisions) {
            const team = division.teams.find(team => team.name === teamName);
            if (team) {
                return team;
            }
        }
        return undefined;
    }

    public addGameToRound(
        round: Round,
        teamAName: string,
        teamABullsEye: number,
        teamAHangJacks: number,
        teamBName: string,
        teamBBullsEye: number,
        teamBHangJacks: number,
        start: string,
        end: string
    ) {
        const teamA = this.findTeam(teamAName);
        const teamB = this.findTeam(teamBName);
        console.log(teamAName)
        console.log({teamA}, {teamB})
        if (teamA && teamB) {
            const game = new Game(
                { team: teamA, bullsEye: teamABullsEye, hangJacks: teamAHangJacks },
                { team: teamB, bullsEye: teamBBullsEye, hangJacks: teamBHangJacks },
                start,
                end
            );

            switch (round) {
                case 1:
                    this.roundOne.push(game);
                    break;
                case 2:
                    this.roundTwo.push(game);
                    break;
                case 3:
                    this.roundThree.push(game);
                    break;
            }
        } else {
            console.error("One or both teams not found.");
        }
    }

    /**
     * Whoever has most amount of BE
     * if BE tie, least amount of BE lost
     * if another tie most wins
     * if another tie most HJ
     * if another tie least HJ lost
     * 
     */
    public getTopTeamsByBullsEye(): Team[] {
        const allTeams: Team[] = this.divisions.flatMap(division => division.teams);
        const sortedTeams = allTeams.sort((a, b) => {
            if (b.bullsEyeWins !== a.bullsEyeWins) {
                return b.bullsEyeWins - a.bullsEyeWins;
            } else if (a.bullsEyeLosses !== b.bullsEyeLosses) {
                return a.bullsEyeLosses - b.bullsEyeLosses;
            } else if ((b.bullsEyeWins + b.hangJackWins) !== (a.bullsEyeWins + a.hangJackWins)) {
                return (b.bullsEyeWins + b.hangJackWins) - (a.bullsEyeWins + a.hangJackWins);
            } else if (b.hangJackWins !== a.hangJackWins) {
                return b.hangJackWins - a.hangJackWins;
            } else {
                return a.hangJackLosses - b.hangJackLosses;
            }
        });
        return sortedTeams;
    }
    
    
}

  
  

  type Divisions = StLouis | Lewis | Jones | Gibbs | Philip;
  
  enum StLouis {
    STRIKERS = "STRIKERS",
    GUYANA = "GUYANA",
    NEW_JERSEY_UNITED = "NEW JERSEY UNITED",
    AIR_FORCE_ONE = "AIR FORCE ONE",
  }
  
  enum Lewis {
    RAIDERS = "RAIDERS",
    GAMBLERS = "GAMBLERS",
    CARIB = "CARIB",
  }
  
  enum Jones {
    SOCOSA = "SOCOSA",
    BLACK_EAGLES = "BLACK EAGLES",
    ORIGINAL_EAGLES = "ORIGINAL EAGLES",
    TRINI_REBELS = "TRINI REBELS",
  }
  
  enum Gibbs {
    UNTOUCHABLES = "UNTOUCHABLES",
    GAME_OF_THRONES = "GAME OF THRONES",
    JUST_FOR_YOU = "JUST 4 YOU",
  }
  
  enum Philip {
    NEW_MILLENNIUM = "NEW MILLENNIUM",
    WHY_WORRY = "WHY WORRY",
    UNITY = "UNITY",
    MONTREAL = "MONTREAL",
  }


  const allEnums = [StLouis, Lewis, Jones, Gibbs, Philip];

  const divisions = allEnums.reduce((acc, currentEnum) => {
      Object.keys(currentEnum).forEach(key => {
          acc[key] = (currentEnum as any)[key];
      });
      return acc;
  }, {} as Record<string, string>);

  export function setup() {
    const tournament = new Tournament();

    const addTeamsToDivision = (division: Division, enumObject: any) => {
        Object.values(enumObject).forEach((teamName) => {
            division.addTeam(new Team(teamName as string));
        });
    };

    const divisionsAndTeams = [
        { name: "St. Louis", enumObject: StLouis },
        { name: "Lewis", enumObject: Lewis },
        { name: "Jones", enumObject: Jones },
        { name: "Gibbs", enumObject: Gibbs },
        { name: "Philip", enumObject: Philip },
    ];

    divisionsAndTeams.forEach(({ name, enumObject }) => {
        const division = new Division(name);
        addTeamsToDivision(division, enumObject);
        tournament.addDivision(division);
    });

    // Add games to round 1
    tournament.addGameToRound(
        1,
        divisions.GAME_OF_THRONES,
        17,
        5,
        divisions.UNTOUCHABLES,
        16,
        7,
        "11:00am",
        "1:45am"
    );
    tournament.addGameToRound(
        1,
        divisions.JUST_FOR_YOU,
        17,
        5,
        divisions.CARIB,
        15,
        4,
        "11:05am",
        "1:35pm"
    );
    tournament.addGameToRound(
        1,
        divisions.AIR_FORCE_ONE,
        17,
        7,
        divisions.NEW_JERSEY_UNITED,
        13,
        7,
        "no entry",
        "no entry"
    );
    tournament.addGameToRound(
        1,
        divisions.STRIKERS,
        17,
        6,
        divisions.GUYANA,
        12,
        7,
        "11:30am",
        "12:50pm"
    );
    tournament.addGameToRound(
        1,
        divisions.NEW_MILLENNIUM,
        17,
        2,
        divisions.WHY_WORRY,
        15,
        4,
        "no entry",
        "no entry"
    );
    tournament.addGameToRound(
        1,
        divisions.UNITY,
        17,
        4,
        divisions.MONTREAL,
        8,
        0,
        "no entry",
        "1:14pm"
    );
    tournament.addGameToRound(
        1,
        divisions.GAMBLERS,
        13,
        2,
        divisions.RAIDERS,
        17,
        6,
        "11:00am",
        "no entry"
    );
    tournament.addGameToRound(
        1,
        divisions.ORIGINAL_EAGLES,
        17,
        4,
        divisions.TRINI_REBELS,
        8,
        5,
        "no entry",
        "12:57pm"
    );
    tournament.addGameToRound(
        1,
        divisions.SOCOSA,
        17,
        4,
        divisions.BLACK_EAGLES,
        10,
        2,
        "11:00am",
        "1:37pm"
    );
    tournament.addGameToRound(
        2,
        divisions.WHY_WORRY,
        17,
        4,
        divisions.UNITY,
        13,
        2,
        "no entry",
        "5:50pm"
    );
    tournament.addGameToRound(
        2,
        divisions.RAIDERS,
        17,
        3,
        divisions.UNTOUCHABLES,
        15,
        8,
        "3:00pm",
        "5:50pm"
    );
    tournament.addGameToRound(
        2,
        divisions.GAME_OF_THRONES,
        17,
        3,
        divisions.JUST_FOR_YOU,
        9,
        1,
        "3:05pm",
        "5:44pm"
    );
    tournament.addGameToRound(
        2,
        divisions.NEW_MILLENNIUM,
        17,
        3,
        divisions.MONTREAL,
        8,
        0,
        "2:45pm",
        "5:20pm"
    );
    tournament.addGameToRound(
        2,
        divisions.SOCOSA,
        17,
        3,
        divisions.TRINI_REBELS,
        6,
        1,
        "3:00pm",
        "5:21pm"
    );
    tournament.addGameToRound(
        2,
        divisions.GAMBLERS,
        17,
        7,
        divisions.CARIB,
        15,
        8,
        "no entry",
        "6:00pm"
    );
    tournament.addGameToRound(
        2,
        divisions.ORIGINAL_EAGLES,
        17,
        7,
        divisions.BLACK_EAGLES,
        13,
        0,
        "no entry",
        "no entry"
    );
    tournament.addGameToRound(
        2,
        divisions.GUYANA,
        17,
        7,
        divisions.NEW_JERSEY_UNITED,
        11,
        6,
        "no entry",
        "no entry"
    );
    tournament.addGameToRound(
        2,
        divisions.STRIKERS,
        17,
        4,
        divisions.AIR_FORCE_ONE,
        9,
        1,
        "3:00pm",
        "5:58pm"
    );
    tournament.addGameToRound(
        3,
        divisions.NEW_JERSEY_UNITED,
        17,
        8,
        divisions.STRIKERS,
        12,
        5,
        "8:15pm",
        "9:29pm"
    );
    tournament.addGameToRound(
        3,
        divisions.NEW_MILLENNIUM,
        17,
        5,
        divisions.UNITY,
        14,
        8,
        "no entry",
        "9:26pm"
    );
    tournament.addGameToRound(
        3,
        divisions.CARIB,
        17,
        7,
        divisions.RAIDERS,
        13,
        4,
        "no entry",
        "no entry"
    );
    tournament.addGameToRound(
        3,
        divisions.GUYANA,
        17,
        3,
        divisions.AIR_FORCE_ONE,
        12,
        7,
        "no entry",
        "no entry"
    );
    tournament.addGameToRound(
        3,
        divisions.WHY_WORRY,
        17,
        2,
        divisions.MONTREAL,
        6,
        2,
        "no entry",
        "9:08pm"
    );
    tournament.addGameToRound(
        3,
        divisions.UNTOUCHABLES,
        17,
        1,
        divisions.JUST_FOR_YOU,
        12,
        7,
        "no entry",
        "9:05pm"
    );
    tournament.addGameToRound(
        3,
        divisions.SOCOSA,
        17,
        3,
        divisions.ORIGINAL_EAGLES,
        7,
        1,
        "no entry",
        "no entry"
    );
    tournament.addGameToRound(
        3,
        divisions.BLACK_EAGLES,
        17,
        3,
        divisions.TRINI_REBELS,
        6,
        1,
        "no entry",
        "8:29pm"
    );
    tournament.addGameToRound(
        3,
        divisions.GAMBLERS,
        17,
        5,
        divisions.GAME_OF_THRONES,
        16,
        3,
        "no entry",
        "8:29pm"
    );

    return tournament;
}