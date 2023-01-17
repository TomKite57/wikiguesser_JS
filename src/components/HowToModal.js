import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: -webkit-fill-available;
  height: auto;
  max-width: 350px;
  max-height: 400px;
  overflow: auto;
  background-color: var(--secondary-background);
  color: var(--primary-text);
  border: 2px solid gray;
  box-shadow: 24rem;
  padding: 2em;
  justify-content: flex-start;
`;

const Button = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
`;

const StyledModal = styled(Modal)`
  color: var(--primary-text);
`;

const HelpIcon = styled(HelpOutlineIcon)`
  color: var(--primary-logo);
`;

export function HowToModal(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}><HelpIcon/></Button>
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
          <Typography id="modal-modal-title" variant="h5" component="h2">
            How to play!
          </Typography>
          <Typography id="modal-modal-paragraph" component="p">
            Guess the Wikipedia article from the hints.
          </Typography>
          <Typography id="modal-modal-paragraph" component="p">
            The hints are common words from the article.
          </Typography>
          <Typography id="modal-modal-paragraph" component="p">
            There are 10 hints in total.
          </Typography>
          <Typography id="modal-modal-paragraph" component="p">
            Good luck!
          </Typography>
        </StyledBox>
      </StyledModal>
    </div>
  );
}