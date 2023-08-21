import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [goodSignupForm, setGoodSignupForm] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [verification, setVerification] = useState(0);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // function for checking if the verification token is valid
  const email_verification = async (emailToken) => {
    await fetch(`/api/staffs/verify/${emailToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((respo) => {
        if (respo.error) {
          // verification 1 means verification error
          setVerification(1);
          setAlertMessage(respo.error);
        } else {
          // verification 2 means verification successful
          setVerification(2);
          setAlertMessage(respo.message);
        }
      });
  };

  useEffect(() => {
    // check if we should try verifying incoming token
    const verify = searchParams.get('verify');
    if (verify) {
      // only new users have verification token so cleanup
      localStorage.removeItem('a4-token');
      localStorage.removeItem('a4-type');
      localStorage.removeItem('a4-name');
      
      // cleanup url parameter so that it doesn't try to verify again
      searchParams.delete('verify');
      setSearchParams(searchParams);

      email_verification(verify);
    } else {
      // regular login page: check if the user's already logged in
      const token = localStorage.getItem('a4-token');
      const em_type = localStorage.getItem('a4-type');
      if (token) {
        // user is manager
        if (em_type === 'manager') {
          navigate('/dashboardmanager');
        // user is kitchen staff
        } else if (em_type === 'kitchen-staff') {
          navigate('/dashboardkitchen');
        // user is waiter
        } else if (em_type === 'waiter') {
          navigate('/dashboardwait');
        }
      }
    }
  });

  // We're registering not logging in
  const handleRegister = () => {
    setIsRegistering(true);
    setWrongPassword(false);
    setGoodSignupForm(true);
    setAlertMessage('');
    setVerification(0);
  };

  // Try registering the user with the given input
  const handleSignUp = async () => {
    setVerification(0); // reset verification alert
    const postParams = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      employee_type: 'manager',
      contact: mobileNumber,
    };

    await fetch('/api/staffs/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postParams),
    })
      .then((res) => res.json())
      .then((respo) => {
        if (respo.error) {
          setGoodSignupForm(false);
          setAlertMessage(respo.error);
        } else {
          setGoodSignupForm(true);
          setAlertMessage('');
        }

        if (respo.verified) {
          // this happens only when email verification is disabled
          const token = respo.token;
          if (token) {
            localStorage.setItem('a4-token', token);
            localStorage.setItem('a4-name', respo.staff.first_name);
            localStorage.setItem('a4-type', respo.staff.employee_type);
            navigate('/dashboardmanager');
          }

        } else if (respo.verified === false) {
          // show that verification email has been sent
          setShowEmailSent(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };

  const handleSignIn = async () => {
    setVerification(0); // reset verification alert
    const postParams = {
      email: email,
      password: password,
    };
    await fetch('/api/staffs/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postParams),
    })
      .then((res) => res.json())
      .then((respo) => {
        console.log(respo);
        const token = respo.token;

        localStorage.setItem('a4-token', token);
        localStorage.setItem('a4-name', respo.first_name);
        localStorage.setItem('a4-type', respo.employee_type);

        if (respo.error) {
          // show user that login failed
          setAlertMessage(respo.error);
          setWrongPassword(true);

        } else {
          // login successful
          setAlertMessage('');
          setWrongPassword(false);

        }

        // navigate to dashboard accordingly
        if (respo.employee_type === 'manager') {
          navigate('/dashboardmanager');
        } else if (respo.employee_type === 'waiter') {
          navigate('/dashboardwait');
        } else if (respo.employee_type === 'kitchen-staff') {
          navigate('/dashboardkitchen');
        }
      })
      .catch((error) => {
        console.log(error);

      });

  };

  // you can press enter in password field to login or register
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (isRegistering) {
        handleSignUp();
      } else {
        handleSignIn();
      }
    }
  };

  // return from register mode to login mode
  const handleBack = () => {
    setIsRegistering(false);
    setWrongPassword(false);
    setGoodSignupForm(true);
    setVerification(0);
    setAlertMessage('');
    setForgotPassword(false);
  };

  // show forgot password screen
  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  // send password reset email
  const sendResetEmail = async () => {

    const postParams = {
      email: email,
    };

    await fetch('/api/staffs/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postParams),
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((respo) => {
        if (respo.error) {
          console.log('respo error');
          console.log(respo);
          setAlertMessage(respo.error);
        } else {
          console.log('no respo error');
          setAlertMessage('');
          setResetEmailSent(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // show user that the password reset email has been sent
  if (showEmailSent) {
    return (
      <Container
        maxWidth="xs"
        sx={{
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#faedcd',
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" align="center">
          Verify your email
        </Typography>
        <Typography sx={{ paddingTop: 8 }} align="center">
          We've sent an email to {email} with a link to verify your email
          address and activate your account. The link in the email will expire
          in 24 hours.
        </Typography>
      </Container>
    );
  }

  // UI to get which email to send password reset link to
  if (forgotPassword) {
    return (
      <Container maxWidth="xs">
        <Typography variant="h4" align="center">
          Forgot Password
        </Typography>
        <Typography align="center">
          Enter your email address below and we'll send you a link to reset your
          password.
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          style={{ marginTop: '10px', backgroundColor: '#e56b6f' }}
          onClick={sendResetEmail}
        >
          Send reset email
        </Button>
        {resetEmailSent && (
          <Typography align="center" style={{ marginTop: '10px' }}>
            If an account exists for {email}, we sent an email with a link to
            reset your password.
          </Typography>
        )}
        <Button
          color="primary"
          variant="outlined"
          style={{ marginTop: '10px' }}
          fullWidth
          onClick={handleBack}
        >
          ⬅ Back
        </Button>
      </Container>
    );
  }

  return (
    <>
      {/* ALERT user that something is not right: wrong credentials */}
      {(wrongPassword || !goodSignupForm) && (
        <Alert severity="error">{alertMessage}</Alert>
      )}
      {/* ALERT user about verification Success && Fail */}
      {verification === 1 && <Alert severity="error">{alertMessage}</Alert>}
      {verification === 2 && <Alert severity="success">{alertMessage}</Alert>}

      <Container maxWidth="xs">
        <Typography variant="h4" align="center" padding={5}>
          {isRegistering ? 'Register' : 'Login'}
        </Typography>
        <form>
          <Grid container spacing={2}>
            {/* Register input fields */}
            {isRegistering && (
              <>
                <Grid item xs={12} sm={6}>
                  {/* first name textfield */}
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* last name textfield */}
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* mobile number textfield */}
                  <TextField
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </Grid>
              </>
            )}
            {/* fields here exist in login mode too */}
            <Grid item xs={12}>
              {/* email textfield */}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              {/* password textfield */}
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </Grid>
          </Grid>
          <br />
          {/* sign in / sign up button */}
          <Button
            variant="contained"
            fullWidth
            style={{ marginTop: '10px', backgroundColor: '#e56b6f' }}
            onClick={isRegistering ? handleSignUp : handleSignIn}
          >
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </Button>
          {/* in login mode, there's register button to go to register mode */}
          {!isRegistering && (
            <Button
              color="primary"
              variant="outlined"
              style={{ marginTop: '10px' }}
              fullWidth
              onClick={handleRegister}
            >
              Register
            </Button>
          )}
          {/* in log in mode, there's password reset button */}
          {!isRegistering && (
            <Button
              color="primary"
              variant="text"
              style={{ marginTop: '10px' }}
              fullWidth
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Button>
          )}
          {/* in register mode, there's back button to go back to sign in mode */}
          {isRegistering && (
            <Button
              color="primary"
              variant="outlined"
              style={{ marginTop: '10px' }}
              fullWidth
              onClick={handleBack}
            >
              ⬅ Back
            </Button>
          )}
        </form>
        <div align="center">
          <h5>Powered by the Spyce System</h5>
        </div>
      </Container>
    </>
  );
};

export default Login;
