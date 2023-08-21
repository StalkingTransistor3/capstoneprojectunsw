import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';

const NewTableForm = (props) => {
  const [open, setOpen] = useState(false);
  const [tableNo, setTableNo] = useState('');
  const [seats, setSeats] = useState('');
  const [isFormValid, setIsFormValid] = useState(false); // New state variable for form validity

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postParams = {
      tableNo: tableNo,
      seats: seats,
    };

    // console.log(postParams);

    const response = await fetch(`/api/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postParams),
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(response);

    // Reset form fields
    setTableNo('');
    setSeats('');

    // Close the dialog
    handleClose();

    props.setRender();

    // window.location.reload();
  };

  // Function to check if all fields are filled
  const validateForm = () => {
    return tableNo !== '' && seats !== '';
  };

  // Update form validity state whenever the field values change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [tableNo, seats]);

  return (
    <div>
      <Button
        startIcon={<TableRestaurantIcon />}
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        New Table
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Table</DialogTitle>
        <DialogContent>
          <TextField
            label="Table Number"
            value={tableNo}
            onChange={(event) => setTableNo(event.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Seats"
            value={seats}
            onChange={(event) => setSeats(event.target.value)}
            fullWidth
            required
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={!isFormValid} // Disable the button if the form is invalid
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewTableForm;
