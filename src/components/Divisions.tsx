import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ExpandMore } from "@mui/icons-material";
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

  return (
    <div>
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
                  <Typography>
                    BullsEye Wins: {team.bullsEyeWins} | BullsEye Losses:{" "}
                    {team.bullsEyeLosses}
                  </Typography>
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
