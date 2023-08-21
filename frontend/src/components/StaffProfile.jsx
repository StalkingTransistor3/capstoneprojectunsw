import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const StaffProfile = (props) => {
  const [open, setOpen] = useState(false);

  const [firstName, setFirstName] = useState(props.first_name);
  const [lastName, setLastName] = useState(props.last_name);
  const [email, setEmail] = useState(props.email);
  const [contact, setContact] = useState(props.contact);
  const [employeeType, SetEmployeeType] = useState(props.employee_type);

  const id = props._id;

  const handleButtonClick = () => {
    setOpen(true);
    console.log(props);
    //get backened data here.
  };

  const handlePopupClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    // Handle confirm logic here, post to backened

    const postParams = {
      first_name: firstName,
      last_name: lastName,
      contact: contact,
      email: email,
      employee_type: employeeType,
    };

    const response = fetch(`/api/staffs/manage/update/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('a4-token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postParams),
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    setOpen(false);

    props.setRender();
  };

  const handleDelete = () => {
    const response = fetch(`/api/staffs/manage/unregister/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('a4-token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    setOpen(false);
    props.setRender();
  };

  useEffect(() => {
    // Perform any additional initialization or side effects here
  }, []);

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<ManageAccountsIcon />}
        color="primary"
        onClick={handleButtonClick}
      >
        Manage
      </Button>
      <Dialog open={open} onClose={handlePopupClose}>
        <DialogTitle>Employee Profile</DialogTitle>
        <DialogContent>
          <FormControl>
            <Select
              defaultValue={employeeType}
              value={employeeType}
              onChange={(event) => SetEmployeeType(event.target.value)}
              margin="normal"
            >
              <MenuItem value="waiter">Waiter</MenuItem>
              <MenuItem value="kitchen staff">Kitchen Staff</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </Select>
          </FormControl>
          <br />
          <div>
            <TextField
              label="First Name"
              defaultValue={firstName}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              defaultValue={lastName}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              defaultValue={email}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact"
              defaultValue={contact}
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            color="error"
            autoFocus
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handlePopupClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleConfirm}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StaffProfile;
