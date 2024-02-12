import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TextField,
  Box,
  Divider,
  Button,
  Paper,
  Typography,
  Grid,
  Avatar,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import { Axios } from '@/utils/Axios';
import '@/styles/deprecated/preloader3.css';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmModal from '@/components/deprecated/Sidebar2';

/**
 * Default Export function for the problem ticket comments
 * Fetch all comments attached to the problem and display as list
 * Parent Component: ViewProblem
 */

function ProblemComments() {
  const query = new URLSearchParams(useLocation().search);
  const problemId = query.get('problemId');
  const [commentOwner, setCommentOwner] = useState();
  const [commentList, setCommentList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [comment, setComment] = useState();
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const [selectedCommentId, setSelectedCommentId] = React.useState(null);

  const token = sessionStorage.getItem('access');
  let loginUser = sessionStorage.getItem('username');

  useEffect(() => {
    getUsers();
    getComments();
  }, []);

  useEffect(() => {
    if (userList.length) {
      setLoading(false);
    }
  });

  useEffect(() => {
    getComments();
  }, [reloading]);

  /**
   * Fetch all comments thats link to the problem
   */
  function getComments() {
    Axios({
      method: 'GET',
      url: `/api/commentId/?commentId=${problemId}`,
    })
      .then((response) => {
        const data = response.data;
        setCommentList(data);
        setReloading(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  /**
   * Fetch users in the database and set the userList state
   */
  function getUsers() {
    Axios({
      method: 'GET',
      url: `/api/userFast/`,
    })
      .then((response) => {
        const data = response.data;
        setUserList(data);
        // Fetch comment owner ID
        setCommentOwner(
          data.find((element) => element.username === String(loginUser)).id
        );
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  /**
   * POST the ticket data to the problem table on the database
   */
  function postComment(event) {
    Axios({
      method: 'POST',
      url: '/api/comments/',

      data: {
        commentId: problemId,
        comment: comment.comment,
        owner: commentOwner,
        // date: isMultipleAffected,
      },
    }).then((response) => {});
    setReloading(true);

    event.preventDefault();
  }

  /**
   * Delete a comment with the specified commentId
   */
  function DeleteComment() {
    Axios({
      method: 'DELETE',
      url: `/api/comments/${selectedCommentId}/`,
    }).then((response) => {
      getUsers();
    });
    setDialogIsOpen(false);
    setReloading(true);
  }

  /**
   * Handle onChange for summary and details field
   */
  function handleChangeField(event) {
    const { name, value } = event.target;
    setComment((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
  }

  /**
   * Handles the delete button of comment passing the commentId
   * @param {commentId} props
   */
  const handleDeleteDialog = (props) => {
    setDialogIsOpen(true);
    setSelectedCommentId(props.id);
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
  };

  /**
   * It loops through the userList array to find the username of the ownerId
   * @param ownerId - The ID of the user you want to get the username of.
   * @returns The value of the username.
   */
  function getUsername(ownerId) {
    let value;

    // Loops through the roles to find exact value
    userList.forEach((name) => {
      if (name.id === ownerId) {
        value = name.username;
      }
    });

    return value;
  }

  return (
    <>
      {loading || reloading ? (
        <div className="spinner">
          <span>Loading. . .</span>
          <div className="half-spinner"></div>
        </div>
      ) : (
        <div>
          {!commentList.length ? (
            <div>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="#525252"
                align="center"
                pt={5}
              >
                No Comments Found
              </Typography>
            </div>
          ) : (
            <>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="#525252"
                align="center"
                pt={4}
                pb={4}
              >
                Comments
              </Typography>

              <Paper style={{ padding: '40px 20px' }} elevation={2}>
                {commentList.map((comment, i) => (
                  <div key={i}>
                    <Grid container wrap="nowrap" spacing={2}>
                      <Grid item>
                        <Avatar alt="userAvatar" src="" />
                      </Grid>
                      <Grid justifyContent="left" item xs zeroMinWidth>
                        <h3 style={{ margin: 0, textAlign: 'left' }}>
                          {String(getUsername(comment.owner))}
                        </h3>
                        <br />
                        <p style={{ textAlign: 'left' }}>{comment.comment}</p>
                        <p style={{ textAlign: 'left', color: 'gray' }}>
                          {moment(comment.date).format('MMM Do YYYY, h:mm a')}
                        </p>
                      </Grid>

                      <Grid item>
                        <Box mt={12}>
                          <ListItemButton
                            onClick={() => {
                              handleDeleteDialog({ id: comment.id });
                            }}
                          >
                            {window.location.pathname === '/problem/edit' && (
                              <ListItemIcon>
                                <DeleteIcon />
                              </ListItemIcon>
                            )}
                          </ListItemButton>
                        </Box>
                      </Grid>
                    </Grid>
                    {commentList.length !== i + 1 ? (
                      <Divider
                        variant="fullWidth"
                        style={{ margin: '30px 0' }}
                      />
                    ) : null}
                  </div>
                ))}
              </Paper>
            </>
          )}
          <Paper
            style={{ padding: '50px 20px 50px', marginTop: '20px' }}
            elevation={2}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#525252"
              align="left"
              pb={3}
            >
              Add New Comment
            </Typography>
            <TextField
              required
              id="comment"
              label="Comment"
              variant="outlined"
              fullWidth
              name="comment"
              onChange={handleChangeField}
            />

            <Box Box textAlign="right" pt={3}>
              <Button type="submit" variant="contained" onClick={postComment}>
                Add Comment
              </Button>
            </Box>
          </Paper>
        </div>
      )}
      {dialogIsOpen && (
        <ConfirmModal
          title="Delete Comment"
          message="Are you sure you want to delete comment?"
          onCancel={handleDialogClose}
          onConfirm={DeleteComment}
        />
      )}
    </>
  );
}

export default ProblemComments;
