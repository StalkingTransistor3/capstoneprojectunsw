import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const EditTable = ({ tableNo, seats, id, setRender }) => {
  const [open, setOpen] = useState(false);

  const [newTableNo, setTableNo] = useState(tableNo);
  const [newSeats, setSeats] = useState(seats);

  const handleButtonClick = () => {
    setOpen(true);
  };

  const handlePopupClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    const postParams = {
      tableNo: newTableNo,
      seats: newSeats,
    };

    console.log(postParams);

    const response = await fetch(`/api/tables/${id}`, {
      method: 'PATCH',
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
    setOpen(false);

    setRender();
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<EditIcon />}
        onClick={handleButtonClick}
      >
        Edit
      </Button>
      <Dialog open={open} onClose={handlePopupClose}>
        <DialogTitle>Edit Table</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              label="Table Number"
              defaultValue={newTableNo}
              value={newTableNo}
              onChange={(event) => setTableNo(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Seats"
              defaultValue={newSeats}
              value={newSeats}
              onChange={(event) => setSeats(event.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handlePopupClose}
            color="primary"
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            color="primary"
            autoFocus
            startIcon={<CheckIcon />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditTable;
