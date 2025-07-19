import React, { useState, useEffect, CSSProperties } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import Divisions from "./Divisions";
import Games from "./Games";
import { setup } from "../util/allFoursGame2025";

const styles: { [key: string]: CSSProperties } = {
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 1 auto",
    overflowY: "auto",
    padding: "1rem",
    paddingBottom: "72px", // Extra space for the fixed navigation
  },
  navWrapper: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    zIndex: 1100, // Ensure nav is on top
  },
  navigation: {
    maxWidth: 500,
    margin: "auto",
  },
};

function Home() {
  const [screen, setScreen] = useState("divisions");
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tournamentSetup = setup();
    setTournament(tournamentSetup);
    // console.log("Tournament setup:", tournamentSetup);
    // console.log("Tournament setup:", tournamentSetup.getTopTeamsByBullsEye());
    setLoading(false); // Set loading to false after setup is complete
  }, []);

  if (loading) {
    return (
      <div
        style={{
          ...styles.root,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.content}>
        {screen === "divisions" && <Divisions tournament={tournament} />}
        {screen === "games" && <Games tournament={tournament} />}
      </div>
      <div style={styles.navWrapper}>
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
      </div>
    </div>
  );
}

export default Home;
