import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Box, Divider, Paper } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tournament } from "../util/allFoursGame";

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

type DivisionsProps = {
  tournament: Tournament;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "Rank", width: 70 },
  { field: "name", headerName: "Team Name", width: 150 },
  { field: "teamWins", headerName: "Wins", width: 50 },
  { field: "bullsEyeWins", headerName: "Bulls Eye Wins", width: 130 },
  { field: "hangJackWins", headerName: "Hang Jack Wins", width: 130 },
  { field: "bullsEyeLosses", headerName: "Bulls Eye Losses", width: 130 },
  { field: "hangJackLosses", headerName: "Hang Jack Losses", width: 130 },
];

function Divisions({ tournament }: DivisionsProps) {
  const [expanded, setExpanded] = React.useState<{
    [key: string]: boolean;
  }>({});

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [panel]: newExpanded,
      }));
    };

  const topTeams = tournament.getTopTeamsByBullsEye().map((team, index) => ({
    id: index + 1,
    name: team.name,
    teamWins: team.wins,
    bullsEyeWins: team.bullsEyeWins,
    hangJackWins: team.hangJackWins,
    bullsEyeLosses: team.bullsEyeLosses,
    hangJackLosses: team.hangJackLosses,
  }));

  return (
    <div>
      <Box sx={{ height: 400, width: "100%", marginBottom: "4rem" }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Top 16 Teams
        </Typography>
        <DataGrid rows={topTeams} columns={columns} hideFooter />
      </Box>
      {tournament.divisions.map((division, index) => (
        <Accordion
          key={division.name}
          expanded={expanded[`panel${index}`] || false}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary
            aria-controls={`panel${index}d-content`}
            id={`panel${index}d-header`}
          >
            <Typography>{division.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {division.teams.map((team, teamIndex) => (
              <Accordion
                key={team.name}
                expanded={expanded[`panel${index}-${teamIndex}`] || false}
                onChange={handleChange(`panel${index}-${teamIndex}`)}
              >
                <AccordionSummary
                  aria-controls={`panel${index}-${teamIndex}d-content`}
                  id={`panel${index}-${teamIndex}d-header`}
                >
                  <Typography>{team.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Won
                    </Typography>
                    <Divider sx={{ marginBottom: 1 }} />
                    <Typography>Bulls Eye: {team.bullsEyeWins}</Typography>
                    <Typography>Hang Jack: {team.hangJackWins}</Typography>
                  </Box>
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Lost
                    </Typography>
                    <Divider sx={{ marginBottom: 1 }} />
                    <Typography>Bulls Eye: {team.bullsEyeLosses}</Typography>
                    <Typography>Hang Jack: {team.hangJackLosses}</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default Divisions;
