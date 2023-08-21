import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Badge,
} from '@mui/material';
import EditMenu from './EditMenu';
import DeleteIcon from '@mui/icons-material/Delete';

const FoodCard = ({
  foodName,
  ingredients,
  price,
  category,
  id,
  available,
  special,
  setRender,
}) => {
  const handleDelete = () => {
    console.log(id);
    const response = fetch(`/api/foodItems/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
      })
      .catch((error) => {
        console.log(error);
      });

    setRender();
  };
  return (
    <Badge
      color="secondary"
      badgeContent={'❤️'}
      invisible={!special}
      sx={{ '& .MuiBadge-badge': { fontSize: 15, maxWidth: 20 } }}
    >
      <Card
        style={{
          display: 'flex',
          flexFlow: 'column',
          alignContent: 'space-around',
          width: '300px',
          background: available ? '#faedcd' : '#6c757d',
        }}
      >
        <CardHeader title={foodName} />
        <CardContent>
          <Typography variant="body1">Ingredients: {ingredients}</Typography>
          <Typography variant="body1">Price: ${price}</Typography>
          <Typography variant="body1">Category: {category}</Typography>
        </CardContent>
        <div
          className="button-container"
          style={{
            display: 'flex',
            gap: '10px',
            paddingBottom: '10px',
            alignContent: 'center',
            marginTop: 'auto',
            paddingLeft: '10px',
          }}
        >
          <span>
            <EditMenu
              key={id}
              id={id}
              foodName={foodName}
              ingredients={ingredients}
              price={price}
              category={category}
              special={special}
              available={available}
              setRender={setRender}
            />
          </span>
          <span>
            <Button
              variant="contained"
              color="error"
              className="delete-button"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </span>
        </div>
      </Card>
    </Badge>
  );
};

export default FoodCard;
