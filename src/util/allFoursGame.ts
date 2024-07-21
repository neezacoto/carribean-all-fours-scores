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

    constructor(name: string) {
        // Initialize properties here
        this.name = name;
        this.bullsEyeWins = 0;
        this.bullsEyeLosses = 0;
        this.hangJackWins = 0;
        this.hangJackLosses = 0;
    }

    public addBullsEyes(won: number, lost: number) {
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

    public findDivision(name: string): Division | undefined {
        return this.divisions.find(division => division.name === name);
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
        divisions.REBELS,
        8,
        5,
        "no entry",
        "12:57pm"
    );
    tournament.addGameToRound(
        1,
        divisions.ORIGINAL_EAGLES,
        17,
        5,
        divisions.REBELS,
        16,
        7,
        "11:00am",
        "1:45pm"
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

    return tournament;
}