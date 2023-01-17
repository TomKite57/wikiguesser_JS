import { useState, useEffect, useMemo} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { List, ListItem } from '@mui/material';
import { getStatsData } from '../stats';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Button from '@mui/material/Button';

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  max-width: 350px;
  background-color: var(--secondary-background);
  color: var(--primary-text);
  border: 2px solid #000;
  box-shadow: 24rem;
  padding: 2em;
  justify-content: flex-start;
`;

const StatNumber = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const StatText = styled.div`
  text-align: center;
`;

const StatsTile = ({stat, text}) => (
  <Box sx={{ p: 1, borderRadius: '3px', m: '0rem 0.25rem', justifyContent: 'center'}}>
    <StatNumber>{stat}</StatNumber>
    <StatText>{text}</StatText>
  </Box>
)

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4,minmax(3.7rem, 8rem));
  grid-template-rows: auto 1fr;
`;

const StatsButton = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
`;

const StyledModal = styled(Modal)`
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
`;

const DistBar = styled.div`
  flex: 0 1 ${props => (Math.round((props.count / props.maxDistribution) * 100))}%;
  background-color: #ddd;
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 0.5rem;
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
`;

const GuessNumber = styled.div`
  width: 1rem;
`;

const LeaderboardIconStyled = styled(LeaderboardIcon)`
  color: var(--primary-text);
`;

const Type = styled(Typography)`
  font-family: "Solway" !important;
`;

export function StatsModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    played,
    winRatio,
    currentStreak,
    maxStreak,
    guessDistribution,
  } = getStatsData();

  const maxDistribution = useMemo(() => Math.max(...Object.values(guessDistribution)), [guessDistribution]);

  return (
    <div>
      <StatsButton onClick={handleOpen}>
        <LeaderboardIconStyled/>
      </StatsButton> 
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{zIndex: 10000}}
      >
        <StyledBox>
          <Box>
            <IconButton onClick={handleClose} sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Type id="modal-modal-title" variant="h5" component="h2">
            Statistics
          </Type>
          <Grid>
            <StatsTile stat={Math.round(winRatio * 100)} text="Win %"/>
            <StatsTile stat={played} text="Played"/>
            <StatsTile stat={currentStreak} text="Current Streak"/>
            <StatsTile stat={maxStreak} text="Max Streak"/>
          </Grid>
          <Type id="modal-modal-title" variant="h6" component="h3">
            Guess Distribution:
          </Type>
          <List>
            {Object.entries(guessDistribution).map(([index, count]) => (
              <ListItem sx={{paddingBottom: 0, paddingTop: '2px'}}
                        key={index}>
                <GuessNumber>{index}</GuessNumber>
                <DistBar
                  count={count}
                  maxDistribution={maxDistribution}
                >{count}</DistBar>
              </ListItem>
            ))}
          </List>
          <Type id="modal-modal-description" sx={{ mt: 2 }}>
            <Button style={{backgroundColor: 'var(--primary-button-unpressed)'}} variant="contained" onClick={() => {window.open("https://crisisrelief.un.org/t/ukraine")}}>🇺🇦 Donate to Ukraine ❤️</Button>
          </Type>
        </StyledBox>
      </StyledModal>
    </div>
  );
}
