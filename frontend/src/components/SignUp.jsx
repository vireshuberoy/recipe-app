import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import axios from "../utils/axios";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  validationCriteria: {
    margin: theme.spacing(1, 0),
    paddingLeft: theme.spacing(2),
  },
  validCriteria: {
    color: "green",
  },
  invalidCriteria: {
    color: "red",
  },
}));

const SignUp = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState([]);

  const isPasswordFine = () => {
    return passwordCriteria.every((ele) => ele.valid === true);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePhoneNumber = () => {
    const fullPhoneNumber = countryCode + phoneNumber;
    const phoneRegex = /^\+\d{1,4}\d{6,}$/;
    if (!phoneRegex.test(fullPhoneNumber)) {
      setPhoneError("Invalid phone number");
    } else {
      setPhoneError("");
    }
  };

  const validateCountryCode = () => {
    const countryCodeRegex = /^\+\d{1,4}$/;
    if (!countryCodeRegex.test(countryCode)) {
      setCountryCodeError("Invalid country code");
    } else {
      setCountryCodeError("");
    }
  };

  const validatePassword = (inputPassword) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const criteria = [
      { text: "At least 8 characters", valid: inputPassword.length >= 8 },
      {
        text: "At least one special character",
        valid: /[!@#$%^&*]/.test(inputPassword),
      },
      { text: "At least one number", valid: /[0-9]/.test(inputPassword) },
    ];
    setPasswordCriteria(criteria);
    return passwordRegex.test(inputPassword);
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if any errors are present
    if (
      (emailError ||
      phoneError ||
      confirmPasswordError ||
      countryCodeError) && !isPasswordFine
    ) {
      alert("Please clear all errors");
      return;
    }
    const response = await axios.post("signup", {
      email,
      name,
      phoneNumber,
      password,
    });
    console.log(response);
  };

  return (
    <Grid container justify="center">
      <Grid item xs={6}>
        <Typography variant="h4" align="center">
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Country Code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                onBlur={validateCountryCode}
                error={!!countryCodeError}
                helperText={countryCodeError}
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={validatePhoneNumber}
                error={!!phoneError}
                helperText={phoneError}
              />
            </Grid>
          </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            error={passwordCriteria.some((criterion) => !criterion.valid)}
            helperText={passwordCriteria.map((criterion, index) => (
              <span
                key={index}
                className={
                  criterion.valid
                    ? classes.validCriteria
                    : classes.invalidCriteria
                }
              >
                {criterion.text}
                <br />
              </span>
            ))}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={validateConfirmPassword}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default SignUp;
