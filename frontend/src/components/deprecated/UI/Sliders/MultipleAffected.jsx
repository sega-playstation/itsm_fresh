import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Switch,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";

export default function MultipleAffected({
  handleAffectedChange,
  formData,
}) {
  const [isMultipleAffected, setIsMultipleAffected] = useState(false);
  const [ticket, setTicket] = useState({
    subject: formData.subject,
    details: formData.details,
    affectedUserSize: formData.affectedUserSize,
  });

  const handleMultipleAffectedChange = (event) => {
    const isChecked = event.target.checked;
    setIsMultipleAffected(isChecked);
    setTicket((prevTicket) => ({
      ...prevTicket,
      affectedUserSize: isChecked ? 0 : 1,
    }));
    handleAffectedChange({ multipleAffectedUser: isChecked });
  };

  /**
   * Handles change event when incident ticket field are change
   */
  const handleAffectedUserSizeChange = (event) => {
    const { name, value } = event.target;
    setTicket((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
    handleAffectedChange({ affectedUserSize: value });
  };

  return (
    <>
      <Box pt={2}>
        <Grid item xs={12} container spacing={2} justifyContent="center">
          <Grid item>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Multiple Affected User"
              labelPlacement="start"
              checked={formData.multipleAffectedUser}
              name="multipleUserAffected"
              onChange={handleMultipleAffectedChange}
            />
          </Grid>
          <Grid item md={1} />
          {formData.multipleAffectedUser && (
            <Box pt={1}>
              <Grid item>
                <FormControl sx={{ width: "200px" }}>
                  <InputLabel id="number-user-affected-label">
                    No. of User Affected
                  </InputLabel>
                  <Select
                    name="affectedUserSize"
                    labelId="number-user-affected"
                    id="number-user-affected"
                    label="No. of User Affected"
                    value={ticket.affectedUserSize}
                    onChange={handleAffectedUserSizeChange}
                  >
                    <MenuItem value={0}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={1}>1-50</MenuItem>
                    <MenuItem value={2}>51-100</MenuItem>
                    <MenuItem value={3}>101+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Box>
          )}
        </Grid>
      </Box>
    </>
  );
}
