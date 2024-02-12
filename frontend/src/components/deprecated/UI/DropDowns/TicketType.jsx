import React, { useState, useEffect } from "react";
import { Axios } from '@/utils/Axios';
import { Autocomplete, TextField } from "@mui/material";

export default function TicketType({ token, handleChange, value }) {
  const [ticketType, setTicketType] = useState(value);
  const [ticketTypeList, setTicketTypeList] = useState([]);

  /**
   *  Fetch all users with the role technician (1) from the database and store it on technicianList state
   */
  function getTicketTypes() {
    Axios({
      method: "GET",
      url: "/api/tickettype/",

    })
      .then((response) => {
        const data = response.data;
        setTicketTypeList(data);
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
  const handleTicketChange = (_, newValue) => {
    setTicketType(newValue);
    handleChange({ ticketType: newValue ? newValue.id : null });
  };

  // Render Value
  useEffect(() => {
    setTicketType(value);
  }, [value]);

  // Render Dropdown
  useEffect(() => {
    getTicketTypes();
  }, []);

  return (
    <>
      <Autocomplete
        name="ticketType"
        id="grouped-ticketType"
        options={ticketTypeList}
        groupBy={(option) => option.category}
        getOptionLabel={(option) => `${option.type}`}
        noOptionsText={"No Results Found"}
        // Might want to copy over and alter the renderOrder property from other autocompletes
        renderInput={(params) => (
          <TextField required {...params} label="Ticket Type" />
        )}
        onChange={handleTicketChange}
        value={ticketTypeList.find((data) => data.id === ticketType) || null}
      />
    </>
  );
}
