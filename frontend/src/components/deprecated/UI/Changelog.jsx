import React, { useState, useEffect } from 'react';
//import "./Changelog.css";
import changelogData from '@/data/deprecated/changelogData.json';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

// AS OF RIGHT NOW THIS IS NEEDING MANUAL EDITING
/*
 * Converting to database implementation
 *
 * Convert localStorage item to a date function from the database entry
 * Convert D_O_N to the latest entry of the database (whatever query)
 * Compare the itsmVisited date to the latest database date
 * Convert <li>s
 */

const DATE_OF_NEWS = new Date(changelogData.date); // Manually edit this for the production update date

export default function Changelog() {
  const [dialogState, setDialogState] = useState(false);
  useEffect(() => {
    let visited = localStorage.getItem('itsmVisited');

    if (!visited) {
      setDialogState(true);
    } else {
      if (DATE_OF_NEWS > new Date(visited)) {
        setDialogState(true);
      }
    }
  }, []);
  const togglePopup = () => {
    setDialogState(false);
    localStorage.setItem('itsmVisited', DATE_OF_NEWS.toString());
  };

  return (
    <>
      <Dialog open={dialogState} onClose={togglePopup}>
        <DialogTitle>{changelogData.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>{changelogData.text}</p>
            <ul>
              {changelogData['changelog-list-items'].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p dangerouslySetInnerHTML={{ __html: changelogData.note }}></p>
          </DialogContentText>
          <DialogActions>
            <Button onClick={togglePopup} autofocus>
              Okay
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
