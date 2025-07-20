import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Typography, Paper, Box, Button, Divider } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Tournament, Game, Buy } from "../util/allFoursGame2025";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMore sx={{ fontSize: "1.5rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const GamePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  borderRadius: 8,
}));

type GamesProps = {
  tournament: Tournament;
};

function Games({ tournament }: GamesProps) {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [allExpanded, setAllExpanded] = React.useState<boolean>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleExpandAll = () => {
    setAllExpanded(!allExpanded);
    setExpanded(allExpanded ? false : "expandAll");
  };

  const rounds = tournament.getGames();
  const roundNames = ["Round One", "Round Two", "Round Three"];

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box>
        {rounds.map((round, roundIndex) => (
          <Accordion
            key={`round${roundIndex}`}
            expanded={
              expanded === "expandAll" || expanded === `panel${roundIndex}`
            }
            onChange={handleChange(`panel${roundIndex}`)}
          >
            <AccordionSummary
              aria-controls={`panel${roundIndex}d-content`}
              id={`panel${roundIndex}d-header`}
            >
              <Typography>{roundNames[roundIndex]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {round.length > 0 ? (
                round.map((game, gameIndex) => {
                  const isBuy = "buy" in game;
                  if (isBuy) {
                    const buyGame = game as Buy;
                    return (
                      <GamePaper key={`${roundIndex}-${gameIndex}`}>
                        <Typography variant="h6" component="div" gutterBottom>
                          <Box fontWeight="fontWeightBold">
                            {buyGame.teamA.team.name} (BUY ROUND)
                          </Box>
                        </Typography>
                        <Divider />
                        <Typography
                          variant="body1"
                          style={{ marginTop: ".5rem" }}
                        >
                          <Box fontWeight="fontWeightBold" display="inline">
                            {buyGame.teamA.team.name}
                          </Box>
                          <Typography>
                            Bulls Eye Won: {buyGame.teamA.bullsEye}
                          </Typography>
                          <Typography>
                            Hang Jacks Won: {buyGame.teamA.hangJacks}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography>
                            Bulls Eye Lost: {buyGame.buy.bullsEye}
                          </Typography>
                          <Typography>
                            Hang Jacks Lost: {buyGame.buy.hangJacks}
                          </Typography>
                        </Typography>
                        <Box
                          style={{
                            display: "flex",
                            gap: "1rem",
                            color: "lightgray",
                            marginTop: "1rem",
                          }}
                        >
                          <Typography variant="body2">
                            Start: {buyGame.start}
                          </Typography>
                          <Typography variant="body2">
                            End: {buyGame.end}
                          </Typography>
                        </Box>
                      </GamePaper>
                    );
                  } else {
                    const regularGame = game as Game;
                    return (
                      <GamePaper key={`${roundIndex}-${gameIndex}`}>
                        <Typography variant="h6" component="div" gutterBottom>
                          <Box fontWeight="fontWeightBold">
                            {regularGame.teamA.team.name} vs{" "}
                            {regularGame.teamB.team.name}
                          </Box>
                        </Typography>
                        <Divider />
                        <Typography
                          variant="body1"
                          style={{ marginTop: ".5rem" }}
                        >
                          <Box fontWeight="fontWeightBold" display="inline">
                            {regularGame.teamA.team.name}
                          </Box>
                          <Typography>
                            Bulls Eye: {regularGame.teamA.bullsEye}
                          </Typography>
                          <Typography>
                            Hang Jacks: {regularGame.teamA.hangJacks}
                          </Typography>
                        </Typography>
                        <Typography
                          style={{ marginTop: ".5rem" }}
                          variant="body1"
                        >
                          <Box fontWeight="fontWeightBold" display="inline">
                            {regularGame.teamB.team.name}
                          </Box>
                          <Typography>
                            Bulls Eye: {regularGame.teamB.bullsEye}
                          </Typography>
                          <Typography>
                            Hang Jacks: {regularGame.teamB.hangJacks}{" "}
                          </Typography>
                        </Typography>
                        <Box
                          style={{
                            display: "flex",
                            gap: "1rem",
                            color: "lightgray",
                            marginTop: "1rem",
                          }}
                        >
                          <Typography variant="body2">
                            Start: {regularGame.start}
                          </Typography>
                          <Typography variant="body2">
                            End: {regularGame.end}
                          </Typography>
                        </Box>
                      </GamePaper>
                    );
                  }
                })
              ) : (
                <Typography variant="body2" color="textSecondary">
                  There are no games yet
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Button variant="contained" onClick={handleExpandAll}>
        {allExpanded ? "Collapse All" : "Expand All"}
      </Button>
    </Box>
  );
}

export default Games;
