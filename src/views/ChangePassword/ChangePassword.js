// YourComponent.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography,
  Grid,
  Select,
  MenuItem,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { LOGOUT_USER, updateUserDetails } from 'store/actions';
import httpService, { endpoints } from 'utils/httpService';

const ChangePassword = ({ ...others }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const role = userDetails.role;

  return (
    <>
      <Typography variant="h4" mb={4} color="black" textAlign="center" sx={{ fontSize: '2.5rem' }}>
        Change Password
      </Typography>
      <Formik
        initialValues={{
          // ... (existing fields)
          newPassword: '',
          confirmPassword: '',
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          // ... (existing validation schema)
          newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('New Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // Your submission logic goes here

            // Check if the password change fields are provided
            if (values.newPassword && values.confirmPassword) {
              // Implement password change logic here
              const passwordChangeRes = await httpService({
                base: endpoints.auth.base,
                endpoint: endpoints.auth.changePassword,
                reqBody: {
                  // Add any necessary fields for password change
                  password: values.newPassword,
                  confirmPassword: values.confirmPassword,
                },
                successNotif: true
              });
            }

            // Continue with the existing profile update logic
            const profileUpdateRes = await httpService({
              base: endpoints.auth.base,
              endpoint: endpoints.auth.updateProfile,
              reqBody: values,
              successNotif: true,
              description: "Password changed. Please login again."
            });

            // Handle profile update response as needed
            if (profileUpdateRes) {
              dispatch({ type: LOGOUT_USER })
            }

            setStatus({ success: true });
            setSubmitting(false);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* ... (existing fields) */}

            {/* New Field for Change Password */}
            <FormControl fullWidth error={Boolean(touched.newPassword && errors.newPassword)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-newPassword">New Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-newPassword"
                type="password"
                value={values.newPassword}
                name="newPassword"
                onBlur={handleBlur}
                onChange={(e) => handleChange(e)}
                label="New Password"
                inputProps={{}}
              />
              {touched.newPassword && errors.newPassword && (
                <FormHelperText error id="standard-weight-helper-text-newPassword">
                  {errors.newPassword}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.confirmPassword && errors.confirmPassword)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-confirmPassword">Confirm Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirmPassword"
                type="password"
                value={values.confirmPassword}
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={(e) => handleChange(e)}
                label="Confirm Password"
                inputProps={{}}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="standard-weight-helper-text-confirmPassword">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </FormControl>

            {/* ... (existing fields) */}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Confirm Changes
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangePassword;
