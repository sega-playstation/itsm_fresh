import React, { useState, useEffect } from "react";
import { Axios } from '@/utils/Axios';
import { Autocomplete, TextField } from "@mui/material";

export default function SecurityGroups({ token, value, handleChange }) {
  const [group, setGroup] = useState(value);
  const [groupList, setGroupList] = useState([]);

  const currentUserRole = sessionStorage.getItem("roleId");
  const ticketOwnerRole = Number.parseInt(currentUserRole);

  const getGroups = async () => {
    try {
      const response = await Axios({
        method: "GET",
        url: `/api/securitygroups/`,

      });
      const data = await response.data;
      setGroupList(data);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  useEffect(() => {
    setGroup(value);
  }, [value]);

  const handleSelect = (event, newValue) => {
    setGroup(newValue.securityGroupId);
    handleChange({ security_group: newValue.securityGroupId });
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <>
      {ticketOwnerRole !== "4" && (
        <Autocomplete
          name="security_group"
          id="security_group_dropdown"
          options={groupList}
          getOptionLabel={(option) => `${option.name}`}
          noOptionsText={"No Results Found"}
          renderInput={(params) => (
            <TextField required {...params} label="Security Group" />
          )}
          onChange={handleSelect}
          value={
            groupList.find((data) => data.securityGroupId === group) || null
          }
        />
      )}
    </>
  );
}
