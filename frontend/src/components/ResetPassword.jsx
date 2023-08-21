import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');

  const resetPassword = () => {
    console.log('Reset Password Started');
    const postParams = {
      password: password,
    };

    fetch(`/api/staffs/reset-password/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postParams),
    })
      .then((res) => res.json())
      .then((respo) => {
        if (respo.error) {
          console.log(respo);
          console.log(respo.error);
        } else {
          navigate('/login');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <TextField
        label="New Password"
        variant="outlined"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        style={{ marginTop: '10px', backgroundColor: '#e56b6f' }}
        onClick={resetPassword}
      >
        Reset Password
      </Button>
    </div>
  );
};

export default ResetPassword;
