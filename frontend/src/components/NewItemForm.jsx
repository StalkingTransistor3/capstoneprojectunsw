import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const NewItemForm = (props) => {
  const [open, setOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isFormValid, setIsFormValid] = useState(false); // New state variable for form validity
  const [special, setSpecial] = useState(false);
  const [available, setAvailable] = useState(true);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log(available);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform necessary actions with the form data, e.g., send a request to the server
    console.log('Form submitted:', { foodName, ingredients, price, category });

    const postParams = {
      food: foodName,
      ingredients: ingredients,
      price: price,
      category: category,
      available: available,
      special: special,
    };

    console.log(postParams);

    const response = fetch('/api/foodItems', {
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
    setFoodName('');
    setIngredients('');
    setPrice('');
    setCategory('');

    // Close the dialog
    handleClose();

    props.setRender();

    // window.location.reload();
  };

  // Function to check if all fields are filled
  const validateForm = () => {
    return (
      foodName !== '' && ingredients !== '' && price !== '' && category !== ''
    );
  };

  // Update form validity state whenever the field values change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [foodName, ingredients, price, category]);

  return (
    <div>
      <Button
        startIcon={<FastfoodIcon />}
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        New item
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Food Name"
              value={foodName}
              onChange={(event) => setFoodName(event.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Ingredients"
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              fullWidth
              required
              margin="normal"
            />

            <div>
              <Checkbox
                label="Available"
                checked={available}
                onChange={(event) => setAvailable(event.target.checked)}
              />
              <label>Available</label>
            </div>

            <div>
              <Checkbox
                label="Special"
                checked={special}
                onChange={(event) => setSpecial(event.target.checked)}
              />
              <label>Special</label>
            </div>
          </form>
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

export default NewItemForm;
