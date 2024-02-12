import{  Axios } from '@/utils/Axios';
import React, { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  colors,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { getDate } from 'date-fns';

function ImportForm() {
  let navigate = useNavigate();

  const token = sessionStorage.getItem('access');
  const currentUserId = sessionStorage.getItem('userId');
  const currentUserSection = sessionStorage.getItem('section');
  const currentUserRole = sessionStorage.getItem('roleId');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [hasError, setHasError] = useState();
  const [field, setField] = useState('');
  const fRef = useRef(null);

  const [file, setFile] = useState();
  const [dataType, setDataType] = useState('Incident');
  const [csvTemplate, setCsvTemplate] = useState(
    `/import/download-${dataType.toLocaleLowerCase()}-template`,
  );

  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  formData.append('roleId', currentUserRole);

  // Used for Asset import
  formData.append('userId', currentUserId);
  formData.append('section', currentUserSection);

  // To get the selected data to be imported
  formData.append('type', dataType);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(hasError);
    setProcessing(true);
    Axios({
      method: 'POST',
      url: '/api/import/',

      data: formData,
    })
      .then((res) => {
        setIsOpen(true);
        setLoading(false);
        setProcessing(false);
        setMessage(res.data.message);
        setHasError(false);
        console.log(res.data);
      })
      .catch((error) => {
        setHasError(true);
        console.log(hasError);
        setField(error.response.data.field);
        if (error.response.status === 409) {
          setIsOpen(true);
          setLoading(false);
          setMessage(error.response.data.message);
          console.log(error.response);
        } else if (error.response.status === 400) {
          setIsOpen(true);
          setLoading(false);
          setMessage(error.response.data.message);
        } else if (file == null) {
          setIsOpen(true);
          setHasError(true);
          setLoading(false);
          setMessage(error.response.data.message);
        } else {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  const handleClose = (e) => {
    setIsOpen(false);
    setFile(null);
    setProcessing(false);
    fRef.current.value = null;
  };

  const handleTypeChange = (event) => {
    setDataType(event.target.value);
    setCsvTemplate(
      `/import/download-${event.target.value.toLocaleLowerCase()}-template`,
    );
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleRedirect = (event) => {
    if (dataType === 'Incident') {
      navigate('/incident/all');
    } else if (dataType === 'Problem') {
      navigate('/problem/all');
    } else if (dataType === 'Asset') {
      navigate('/asset/all');
    } else if (dataType === 'Change') {
      navigate('/change/all');
    } else {
      let path = '/users/all';

      if (
        currentUserRole === '3' ||
        currentUserRole === '4' ||
        currentUserRole === '2'
      ) {
        path = '/users/class-all';
      }

      navigate(path);
    }
  };

  // Layout purposes
  const types = [
    { name: 'Incident' },
    { name: 'Problem' },
    { name: 'Asset' },
    { name: 'Change Request' },
    { name: 'User' },
  ];

  const onDownload = (url) => {
    // e.preventDefault()
    let date = new Date();

    Axios({
      method: 'GET',
      url: csvTemplate,

      responseType: 'blob',
    }).then((response) => {
      // create file link in browser's memory
      let blob = new Blob([response.data], { type: 'text/csv' });
      const href = URL.createObjectURL(blob);
      // create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute(
        'download',
        `${dataType}_template_${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  return (
    <Paper
      elevation={10}
      sx={{
        mt: '10vh',
        mx: 'auto',
        textAlign: 'center',
        px: 8,
        py: 3,
        width: '50%',
      }}
    >
      {currentUserRole === '1' || currentUserRole === '3' ? (
        <>
          <Box textAlign="center">
            <h2>Import CSV</h2>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container rowSpacing={1} spacing={2}>
              <Grid item xs={5.5}>
                <Box textAlign="right">
                  <p>Data Type:</p>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box pb={2}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <Select
                      options={types}
                      onChange={handleTypeChange}
                      defaultValue={dataType}
                    >
                      {types.map((dataTypes) => (
                        <MenuItem value={dataTypes.name}>
                          {dataTypes.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <Button onClick={onDownload} download=".csv">
                                    Download Template
                                </Button> */}
                  </FormControl>
                </Box>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={2} />

                <Grid item xs={8}>
                  <h4>
                    Select a .csv file containing the data you would like to
                    import
                  </h4>
                </Grid>

                <Grid item xs={2} />
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={4.5} />

                <Grid item xs={3}>
                  <input
                    ref={fRef}
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                  />
                  <LoadingButton
                    type="submit"
                    loading={processing}
                    disabled={processing}
                    loadingIndicator="Processing..."
                  >
                    Upload
                  </LoadingButton>
                </Grid>

                <Grid item xs={4.5} />
              </Grid>
            </Grid>
          </form>

          <Dialog open={isOpen}>
            {/* {processing && file != null ?
                <DialogTitle>Please wait while we upload the data.</DialogTitle> : */}
            <DialogActions>
              {hasError === true ? (
                <div>
                  <DialogTitle>Import Unsuccessful</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {file != null ? <p>{field}</p> : ''}
                      <p>{message}</p>
                    </DialogContentText>
                  </DialogContent>
                  <Button onClick={handleClose} autoFocus>
                    Try again
                  </Button>
                </div>
              ) : (
                <div>
                  <DialogTitle>Import Successful</DialogTitle>
                  <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                  </DialogContent>
                  <Button onClick={handleRedirect} autoFocus>
                    Redirect to {dataType} List
                  </Button>
                  <Button onClick={handleClose}>Continue</Button>
                </div>
              )}
            </DialogActions>
            {/* } */}
          </Dialog>
        </>
      ) : (
        <>
          <Box textAlign="center">
            <h2>Access Denied</h2>
          </Box>
          <Box textAlign="center">
            <h4>Admins and Instructors only allowed to access.</h4>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default ImportForm;
