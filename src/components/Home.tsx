import React, { useState, useEffect, CSSProperties } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Grid,
  CircularProgress,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import Divisions from "./Divisions";
import Games from "./Games";
import { setup } from "../util/allFoursGame";

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

function Home() {
  const [screen, setScreen] = useState("divisions");
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tournamentSetup = setup();
    setTournament(tournamentSetup);
    console.log("Tournament setup:", tournamentSetup);
    setLoading(false); // Set loading to false after setup is complete
  }, []);

  if (loading) {
    return (
      <Container style={styles.container}>
        <CircularProgress />
      </Container>
    );
  }

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
