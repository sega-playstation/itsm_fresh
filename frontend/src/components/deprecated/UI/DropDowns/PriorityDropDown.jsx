import React, { useState, useEffect } from "react";
import { Axios } from '@/utils/Axios';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function PriorityDropDown({
  value,
  handleInputChange,
  priorityError,
  children,
}) {
  const token = sessionStorage.getItem("access");
  const [priority, setpriority] = useState(value);
  const [priorityList, setPriorityList] = useState([]);

  const getPriorityData = async () => {
    try {
      const response = await Axios({
        method: "get",
        url: "/api/priority/",

      });

      const data = await response.data;
      setPriorityList(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  // Handles Selecting Value
  const handleChange = (event) => {
    const newValue = event.target.value;
    setpriority(newValue);
    handleInputChange({ priority: newValue });
  };

  useEffect(() => {
    getPriorityData();
  }, []);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="priority-label">Priority Level</InputLabel>
        <Select
          required
          labelId="priority-select-label-id"
          id="priority-id"
          value={value}
          label="Priority Level"
          error={priorityError ? { borderColor: "#d32f2f" } : null}
          onChange={handleChange}
        >
          <MenuItem value={priority}>Select a Priority Level</MenuItem>
          {priorityList &&
            priorityList.map((event) => (
              <MenuItem key={event.priority_id} value={event.priority_id}>
                ({event.priority_id}) {event.priority_name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {children}
    </>
  );
}
