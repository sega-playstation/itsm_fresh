import React, { useState, useEffect } from "react";
import { Axios } from '@/utils/Axios';
import { Box, TextField } from "@mui/material";

export default function TicketOpenedBy({
  token,
  value,
  formType,
  handleChange,
  loginUser,
}) {
  const [ticketOwnerId, setTicketOwnerId] = useState("");

  useEffect(() => {
    if (formType === "Create") {
      Axios({
        method: "GET",
        url: "/api/userFast/",

      })
        .then((response) => {
          const data = response.data;
          // Fetch ticket owner ID
          const owner = data.find((element) => element.username === loginUser);
          handleChange({ ticketOwnerId: owner.id });
          if (owner) {
            setTicketOwnerId(owner.id);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    }
  }, []);

  return (
    <>
      <Box pt={2}>
        <TextField
          id="ticketOpenedBy"
          label="Ticket Opened By"
          variant="filled"
          value={value}
          disabled
          fullWidth
        />
      </Box>
    </>
  );
}
