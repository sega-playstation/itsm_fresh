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
  const [ticketOwnerId, setTicketOwnerId] = useState(value);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    Axios({
      method: "GET",
      url: "/api/userFast/",

    })
      .then((response) => {
        const data = response.data;
        // Fetch ticket owner ID
        const owner = data.find((element) => element.username === loginUser);
        setUserList(data);
        setTicketOwnerId(owner.id);
        if (owner && formType === "Create") {
          // Move handleChange inside the if block
          handleChange({ ticketOwnerId: owner.id });
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }, []); // Add dependencies here

  console.log(ticketOwnerId)

  const user = userList.find((user) => user.id === value);
  const username = user?.username;

  return (
    <>
      <Box pt={2}>
        <TextField
          id="ticketOpenedBy"
          label="Ticket Opened By"
          variant="filled"
          value={username}
          disabled
          fullWidth
        />
      </Box>
    </>
  );
}
