import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import{  Axios } from '@/utils/Axios';
import { Autocomplete, TextField } from '@mui/material';

export default function SelectUser({
  token,
  name,
  label,
  handleChange,
  value,
}) {
  const [user, setUser] = useState(value);
  const [userList, setUserList] = useState([]);

  const currentUserRole = sessionStorage.getItem('roleId');
  const ticketOwnerRole = Number.parseInt(currentUserRole);

  const getUsers = async () => {
    return Axios({
      method: 'GET',
      url: '/api/userFast/',

    })
      .then((response) => {
        const data = response.data;
        const sortedData = data.sort((a, b) =>
          a.first_name.localeCompare(b.first_name),
        );
        const owner = sortedData.find((element) => element.username);
        return { sortedData, owner };
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };
  // Handles the Changing of State
  const handleUserChange = (_, newValue) => {
    setUser(newValue);
    handleChange({ [name]: newValue ? newValue.id : null });
  };

  // Render Value
  useEffect(() => {
    setUser(value);
  }, [value]);

  // Render Dropdown
  useEffect(() => {
    getUsers().then(({ sortedData }) => {
      setUserList(sortedData);
    });
  }, []);

  return (
    <>
      <Autocomplete
        id="grouped-userList"
        options={userList.sort((a, b) =>
          a.first_name.localeCompare(b.first_name),
        )}
        //groupBy={(option) => option.first_name[0]}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        noOptionsText={'No Results Found'}
        renderOption={(props, option, index) => {
          const key = `listItem-${index}-${option.id}`;
          return (
            <li {...props} key={key}>
              {option.first_name} {option.last_name}
            </li>
          );
        }} // This renderOption resolves a problem stemming from duplicate names.
        renderInput={(params) => <TextField {...params} label={label} />}
        onChange={handleUserChange}
        value={userList.find((data) => data.id === user) || null}
      />

      {ticketOwnerRole === 1 ? (
        <Link
          to="/users/new"
          style={{ textDecoration: 'none', fontSize: '0.9rem' }}
        >
          Create new user
        </Link>
      ) : (
        console.log('Unauthorized')
      )}
    </>
  );
}
