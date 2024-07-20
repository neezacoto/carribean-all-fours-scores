import React, { useState, CSSProperties } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Grid,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import Divisions from "./Divisions";
import Games from "./Games";

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  navContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navigation: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    maxWidth: 500,
    padding: "1rem",
  },
  content: {
    width: "100%",
    height: "100%",
  },
};

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

  constructor() {
    // Initialize properties here
    this.name = "";
    this.bullsEyeWins = 0;
    this.bullsEyeLosses = 0;
    this.hangJackWins = 0;
    this.hangJackLosses = 0;
  }

  addBullsEyes(won: number, lost: number) {
    this.bullsEyeWins += won;
    this.bullsEyeLosses += lost;
  }

  addHangJacks(won: number, lost: number) {
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

  addTeam(team: Team) {
    this.teams.push(team);
  }
}

class Tournement {
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
}

function Home() {
  const [screen, setScreen] = useState("divisions");

  return (
    <Container style={styles.container}>
      <Grid container direction="column" style={styles.content}>
        <Grid
          item
          xs={11}
          container
          alignItems="center"
          justifyContent="center"
        >
          {screen === "divisions" && <Divisions />}
          {screen === "games" && <Games />}
        </Grid>
        <Grid item xs={1} style={styles.navContainer}>
          <BottomNavigation
            showLabels
            value={screen}
            onChange={(event, newValue) => {
              setScreen(newValue);
            }}
            style={styles.navigation}
          >
            <BottomNavigationAction
              label="Divisions"
              icon={<GroupsIcon />}
              value="divisions"
            />
            <BottomNavigationAction
              label="Games"
              icon={<ViewDayIcon />}
              value="games"
            />
          </BottomNavigation>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
