import React, { useState } from "react";

import { Box, Tab, Tabs, TextField } from "@mui/material";
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

export default function BusinessJustififyAndPlanTabs({ formData }) {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Purpose" {...a11yProps(0)} />
          <Tab label="Need" {...a11yProps(1)} />
          <Tab label="Duration" {...a11yProps(2)} />
          <Tab label="Install Plan" {...a11yProps(3)} />
          <Tab label="Backout Plan" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tab} index={0}>
        <TextField
          placeholder="Write a Description (300 Characters Limit)"
          multiline
          rows={3}
          fullWidth
          type="text"
          name="purpose"
          label="Purpose"
          variant="filled"
          value={formData.purpose}
          readOnly
        />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <TextField
          placeholder="Write a Description (300 Characters Limit)"
          multiline
          rows={3}
          fullWidth
          type="text"
          name="need"
          label="Need"
          variant="filled"
          value={formData.need}
          readOnly
        />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={2}>
        <TextField
          placeholder="Write a Description (300 Characters Limit)"
          multiline
          rows={3}
          fullWidth
          type="text"
          name="duration"
          label="Duration"
          variant="filled"
          value={formData.duration}
          readOnly
        />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={3}>
        <TextField
          placeholder="Write a Description (300 Characters Limit)"
          multiline
          rows={3}
          fullWidth
          type="text"
          name="install_plan"
          label="Install Plan"
          variant="filled"
          value={formData.backout_plan_description}
          readOnly
        />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={4}>
        <TextField
          placeholder="Write a Description (300 Characters Limit)"
          multiline
          rows={3}
          fullWidth
          type="text"
          name="backout_plan"
          label="Backout Plan"
          variant="filled"
          value={formData.install_plan_description}
          readOnly
        />
      </CustomTabPanel>
    </Box>
  );
}
