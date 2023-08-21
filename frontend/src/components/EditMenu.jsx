import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const EditMenu = ({
  foodName,
  ingredients,
  price,
  category,
  available,
  special,
  id,
  setRender,
}) => {
  const [open, setOpen] = useState(false);

  const [newFoodName, setFoodName] = useState(foodName);
  const [newIngredients, setIngredients] = useState(ingredients);
  const [newPrice, setPrice] = useState(price);
  const [newCategory, setCategory] = useState(category);
  const [newAvaialble, setAvailable] = useState(available);
  const [newSpecial, setSpecial] = useState(special);

  const handleButtonClick = () => {
    setOpen(true);

    //get backened data here.
  };

  const handlePopupClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    const postParams = {
      food: newFoodName,
      ingredients: newIngredients,
      price: newPrice,
      category: newCategory,
      special: newSpecial,
      available: newAvaialble,
    };

    console.log(postParams);

    const response = fetch(`/api/foodItems/${id}`, {
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
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <br />
          <div>
            <TextField
              label="Item Name"
              defaultValue={newFoodName}
              value={newFoodName}
              onChange={(event) => setFoodName(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ingredients"
              defaultValue={newIngredients}
              value={newIngredients}
              onChange={(event) => setIngredients(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price $"
              defaultValue={newPrice}
              value={newPrice}
              onChange={(event) => setPrice(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Category"
              defaultValue={newCategory}
              value={newCategory}
              onChange={(event) => setCategory(event.target.value)}
              fullWidth
              margin="normal"
            />

            <div>
              <Checkbox
                label="Available"
                checked={newAvaialble}
                onChange={(event) => setAvailable(event.target.checked)}
              />
              <label>Available</label>
            </div>

            <div>
              <Checkbox
                label="Special"
                checked={newSpecial}
                onChange={(event) => setSpecial(event.target.checked)}
              />
              <label>Special</label>
            </div>
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

export default EditMenu;
