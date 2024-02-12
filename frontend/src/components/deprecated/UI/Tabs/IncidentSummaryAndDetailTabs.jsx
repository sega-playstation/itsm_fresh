import React, { useState } from "react";

import { Grid, Box, Tab, Tabs, TextField } from "@mui/material";
import PropTypes from "prop-types";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function IncidentSummaryAndDetailTabs({
  formData,
  readOnly,
  handleChange,
}) {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSummaryChange = (event) => {
    if (!readOnly) {
      const value = event.target.value;
      handleChange({ subject: value });
    }
  };

  const handleDetailChange = (event) => {
    if (!readOnly) {
      const value = event.target.value;
      handleChange({ details: value });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid item container justifyContent="center">
        <Grid item xs={9}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Summary" {...a11yProps(0)} />
              <Tab label="Details" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </Grid>
      </Grid>
      <CustomTabPanel value={tab} index={0}>
        <Grid item container justifyContent="center">
          <Grid item xs={9}>
            <TextField
              placeholder="Write a Description (300 Characters Limit)"
              multiline
              rows={4}
              fullWidth
              type="text"
              name="summary"
              label="Summary"
              variant="filled"
              readOnly={readOnly ? readOnly : false}
              value={formData.subject}
              inputProps={{ maxLength: 300 }}
              onChange={handleSummaryChange}
            />
          </Grid>
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <Grid item container justifyContent="center">
          <Grid item xs={9}>
            <TextField
              placeholder="Write a Description (300 Characters Limit)"
              multiline
              rows={4}
              fullWidth
              type="text"
              name="details"
              label="Details"
              variant="filled"
              readOnly={readOnly ? readOnly : false}
              value={formData.details}
              inputProps={{ maxLength: 300 }}
              onChange={handleDetailChange}
            />
          </Grid>
        </Grid>
      </CustomTabPanel>
    </Box>
  );
}
