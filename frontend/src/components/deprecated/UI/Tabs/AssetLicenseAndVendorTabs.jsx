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

export default function AssetLicenseAndVendorTabs({ formData }) {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
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
              <Tab label="License Details" {...a11yProps(0)} />
              <Tab label="Vendor Details" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </Grid>
      </Grid>
      <CustomTabPanel value={tab} index={0}>
        <Grid item container justifyContent="center">
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Vendor Name"
              value={formData.vendor_name}
              readOnly
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Product Name"
              value={formData.product_name}
              readOnly
            />
          </Grid>

          <Grid item xs={12} pt={2} />

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Current Version"
              value={formData.current_version}
              readOnly
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Vendor Support"
              value={formData.vendor_support}
              readOnly
            />
          </Grid>
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <Grid item container justifyContent="center">
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="License Name"
              value={formData.license_name}
              readOnly
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="License Type"
              value={formData.License_type}
              readOnly
            />
          </Grid>

          <Grid item xs={12} pt={2} />

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="License Cost"
              value={formData.license_cost}
              readOnly
            />
          </Grid>
        </Grid>
      </CustomTabPanel>
    </Box>
  );
}
