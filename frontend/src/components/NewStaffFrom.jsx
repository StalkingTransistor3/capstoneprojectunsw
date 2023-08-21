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
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const NewStaffForm = (props) => {
  const [open, setOpen] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [employeeType, SetEmployeeType] = useState('');
  const [password, setPassword] = useState('');

  const handleButtonClick = () => {
    setOpen(true);
    //get backened data here.
  };

  const handlePopupClose = () => {
    setOpen(false);
    props.setRender();
  };

  const handleConfirm = async () => {
    // Handle confirm logic here, post to backened

    const postParams = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      employee_type: employeeType,
      contact: contact,
    };

    const response = await fetch(`/api/staffs/register/`, {
      method: 'POST',
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

    props.setRender();
    handlePopupClose();

    setFirstName('');
    setLastName('');
    setContact('');
    setEmail('');
    SetEmployeeType('');
    setPassword('');
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        color="success"
        onClick={handleButtonClick}
      >
        New Employee
      </Button>
      <Dialog open={open} onClose={handlePopupClose}>
        <DialogTitle>New Employee Details</DialogTitle>
        <DialogContent>
          <FormControl>
            <Select
              value={employeeType}
              onChange={(event) => SetEmployeeType(event.target.value)}
              displayEmpty
              renderValue={(value) => (value === '' ? 'Position' : value)}
              margin="normal"
            >
              <MenuItem value="waiter">Waiter</MenuItem>
              <MenuItem value="kitchen-staff">Kitchen Staff</MenuItem>
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
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
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

export default NewStaffForm;
