import React, { useState, useEffect } from "react";
import { Axios } from '@/utils/Axios';
import { Autocomplete, TextField } from "@mui/material";

export default function AssignedTechnicians({ token, name, handleChange, value }) {
  const [technician, setTechnician] = useState(value);
  const [technicianList, setTechnicianList] = useState([]);

  /**
   *  Fetch all users with the role technician (1) from the database and store it on technicianList state
   */
  function getTechnicians() {
    Axios({
      method: "GET",
      url: "/api/getTechnician/?role_id=2",

    })
      .then((response) => {
        const data = response.data;
        setTechnicianList(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  // Handles the Changing of State
  const handleSelect = (_, newValue) => {
    setTechnician(newValue);
    handleChange({ [name]: newValue ? newValue.id : null });
  };

  // Render Value
  useEffect(() => {
    setTechnician(value);
  }, [value]);

  // Render Dropdown
  useEffect(() => {
    getTechnicians();
  }, []);

  return (
    <>
      <Autocomplete
        id="grouped-userList"
        options={technicianList.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        )}
        //groupBy={(option) => option.first_name[0]}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        noOptionsText={"No Results Found"}
        renderOption={(props, option, index) => {
          const key = `listItem-${index}-${option.id}`;
          return (
            <li {...props} key={key}>
              {option.first_name} {option.last_name}
            </li>
          );
        }} // This renderOption resolves a problem stemming from duplicate names.
        renderInput={(params) => <TextField {...params} label="Assigned Technician" />}
        onChange={handleSelect}
        value={technicianList.find((data) => data.id === technician) || null}
      />
    </>
  );
}
