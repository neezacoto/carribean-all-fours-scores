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

        if (teamA.bullsEye > teamB.bullsEye) {
            teamA.team.addWin();
        } else if (teamB.bullsEye > teamA.bullsEye) {
            teamB.team.addWin();
        }

        teamA.team.addBullsEyes(teamA.bullsEye, teamB.bullsEye);
        teamA.team.addHangJacks(teamA.hangJacks, teamB.hangJacks);

        teamB.team.addBullsEyes(teamB.bullsEye, teamA.bullsEye);
        teamB.team.addHangJacks(teamB.hangJacks, teamA.hangJacks);
    }
}
export class Buy {
    teamA: TeamEntry;
    buy: {bullsEye: number; hangJacks: number };
    start: string;
    end: string;
    constructor(teamA: TeamEntry, buy: {bullsEye: number; hangJacks: number }, start: string, end: string) {
        this.teamA = teamA;
        this.buy = buy;
        this.start = start;
        this.end = end;

        teamA.team.addWin();
        teamA.team.addBuy();
        teamA.team.addBullsEyes(teamA.bullsEye, buy.bullsEye);
        teamA.team.addHangJacks(teamA.hangJacks, buy.hangJacks);
    }
}

class Team {
    name: string;
    bullsEyeWins: number;
    bullsEyeLosses: number;
    hangJackWins: number;
    hangJackLosses: number;
    wins: number;
    buys: number;

    constructor(name: string) {
        // Initialize properties here
        this.name = name;
        this.bullsEyeWins = 0;
        this.bullsEyeLosses = 0;
        this.hangJackWins = 0;
        this.hangJackLosses = 0;
        this.wins = 0;
        this.buys = 0;
    }

    public addBullsEyes(won: number, lost: number) {
        this.bullsEyeWins += won;
        this.bullsEyeLosses += lost;
        
    }

    public addHangJacks(won: number, lost: number) {
        this.hangJackWins += won;
        this.hangJackLosses += lost;
    }

    public addWin() {
        this.wins++;
    }

    public addBuy() {
        this.buys++;
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
    roundOne: (Game | Buy)[];
    roundTwo: (Game | Buy)[];
    roundThree: (Game | Buy)[];
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

    public addBuyRound(
        round: Round,
        teamAName: string,
        avgHJW: number [],
        avgBEL: number [],
        avgHJL: number [],
        start: string,
        end: string
    ) {
        const teamA = this.findTeam(teamAName);
        console.log(teamAName)


        if (teamA) {
            const buy = new Buy(
                { team: teamA, bullsEye: 18, hangJacks: averageFloor(...avgHJW) },
                { bullsEye: averageFloor(...avgBEL), hangJacks: averageFloor(...avgHJL) },
                start,
                end
            );

            switch (round) {
                case 1:
                    this.roundOne.push(buy);
                    break;
                case 2:
                    this.roundTwo.push(buy);
                    break;
                case 3:
                    this.roundThree.push(buy);
                    break;
            }
        } else {
            console.error("One or both teams not found.");
        }
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
  
  enum Superville {
    SACOSAH = "SACOSAH",
    BOSTON = "BOSTON",
    STRIKERS = "STRIKERS",
    ORIGINAL_EAGLES = "ORIGINAL EAGLES",
    PHOENIX = "PHOENIX",
  }
  
  enum Clouden {
    NEW_MILLENNIUM = "NEW MILLENNIUM",
    GAME_OF_THRONES = "GAME OF THRONES",
    NEW_JERSEY_UNITED = "NEW JERSEY UNITED",
    TRINI_REBELS = "TRINI REBELS",
  }
  
  enum Eccles {
    BLACK_EAGLES = "BLACK EAGLES",
    UNITY = "UNITY",
    MARYLAND_OUTSIDERS = "MARYLAND OUTSIDERS",
    JB_GAMBLERS = "JB GAMBLERS"
  }
  
  enum Philip {
    WHY_WORRY = "WHY WORRY",
    GUYANA_JAGUARS = "GUYANA JAGUARS",
    RAIDERS = "RAIDERS",
    JUST_4_YOU = "JUST 4 YOU",
  }


  // Utility function to calculate the floored average of numbers
    function averageFloor(...nums: number[]): number {
        if (nums.length === 0) return 0;
        const sum = nums.reduce((acc, n) => acc + n, 0);
        return Math.floor(sum / nums.length);
    }


  const allEnums = [Superville, Clouden, Eccles, Philip, Buy];

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
        { name: "Superville", enumObject: Superville },
        { name: "Clouden", enumObject: Clouden },
        { name: "Eccles", enumObject: Eccles },
        { name: "Philip", enumObject: Philip },
    ];

    divisionsAndTeams.forEach(({ name, enumObject }) => {
        const division = new Division(name);
        addTeamsToDivision(division, enumObject);
        tournament.addDivision(division);
    });

    // Add games to round 1
    // tournament.addGameToRound(
    //     1,
    //     divisions.GAME_OF_THRONES,
    //     17,
    //     5,
    //     divisions.UNTOUCHABLES,
    //     16,
    //     7,
    //     "11:00am",
    //     "1:45am"
    // );
    tournament.addGameToRound(
        1,
        divisions.MARYLAND,
        18,
        4,
        divisions.JB_GAMBLERS,
        16,
        4,
        "'11:00am'",
        "2:07pm"
    );
    tournament.addGameToRound(
        1,
        divisions.RAIDERS,
        18,
        6,
        divisions.JUST_4_YOU,
        15,
        8,
        "10:30am",
        "2:00pm"
    );
    tournament.addGameToRound(
        1,
        divisions.BLACK_EAGLES,
        18,
        2,
        divisions.UNITY,
        4,
        1,
        "no entry",
        "1:00pm"
    );
    tournament.addGameToRound(
        1,
        divisions.GUYANA_JAGUARS,
        18,
        3,
        divisions.WHY_WORRY,
        14,
        5,
        "11:00am",
        "1:30pm"
    );
    tournament.addGameToRound(
        1,
        divisions.STRIKERS,
        18,
        6,
        divisions.ORIGINAL_EAGLES,
        10,
        4,
        "11:00am",
        "1:39pm"
    );
    tournament.addGameToRound(
        1,
        divisions.NEW_MILLENNIUM,
        18,
        9,
        divisions.GAME_OF_THRONES,
        10,
        1,
        "11:00am",
        "no entry"
    );
    tournament.addGameToRound(
        1,
        divisions.SACOSAH,
        18,
        5,
        divisions.BOSTON,
        15,
        7,
        "11:00am",
        "no entry"
    );
    tournament.addGameToRound(
        2,
        divisions.ORIGINAL_EAGLES,
        18,
        4,
        divisions.PHOENIX,
        11,
        2,
        "4:00pm",
        "6:27pm"
    );
    tournament.addGameToRound(
        2,
        divisions.JUST_4_YOU,
        18,
        9,
        divisions.GUYANA_JAGUARS,
        14,
        3,
        "4:00pm",
        "6:30pm"
    );
    tournament.addGameToRound(
        2,
        divisions.STRIKERS,
        18,
        9,
        divisions.BOSTON,
        13,
        5,
        "4:10pm",
        "6:30pm"
    );
    tournament.addGameToRound(
        2,
        divisions.JB_GAMBLERS,
        18,
        3,
        divisions.UNITY,
        10,
        4,
        "4:00pm",
        "no entry"
    );
    tournament.addGameToRound(
        2,
        divisions.RAIDERS,
        18,
        5,
        divisions.WHY_WORRY,
        17,
        7,
        "4:00pm",
        "6:45pm"
    );
    tournament.addGameToRound(
        2,
        divisions.NEW_MILLENNIUM,
        18,
        8,
        divisions.NEW_JERSEY_UNITED,
        16,
        7,
        "4:00pm",
        "no entry"
    );
    
    tournament.addGameToRound(
        2,
        divisions.MARYLAND_OUTSIDERS,
        18,
        7,
        divisions.BLACK_EAGLES,
        17,
        4,
        "4:00pm",
        "7:26pm"
    );

    tournament.addBuyRound(
        3,
        divisions.STRIKERS,
        [6, 9],
        [10, 13],
        [4, 5],
        "no entry",
        "no entry"
    );
    
    
    

    return tournament;
}