type TeamEntry = {
    team: Team;
    bullsEye: number;
    hangJacks: number;
  };
  
  class Game {
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
  
    private addGameToRound(round: Round, game: Game) {
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
    }
  }

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

    //Games
  
    return tournament;
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
