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
  Container,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { updateUserDetails } from 'store/actions';
import httpService, { endpoints } from 'utils/httpService';

const Edit_page = ({ ...others }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const role = userDetails.role;


  const [ofhr, setOfhr] = useState({
    day: "",
    slot: ""
  });
  // console.log(userDetails);
  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      // Your submission logic goes here
      setStatus({ success: true });
      setSubmitting(false);
      const res = await httpService({
        base: endpoints.auth.base,
        endpoint: endpoints.auth.updateProfile,
        reqBody: values,
        successNotif: true,
      });

      dispatch(updateUserDetails({
        firstName: values.firstName,
        lastName: values.lastName,
        coursesAssigned: values.coursesAssigned,
        officeHours: values.officeHours,
        department: values.department,
      }));

      if (res) {
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };
  return (
    <Container maxWidth="sm"> {/* Wrap the form in a Container with maxWidth */}
      <>
        <Typography variant="h4" mb={4} color="black" textAlign="center" sx={{ fontSize: '2.5rem' }} style={{ marginTop: '20px' }}>
          View/Edit Your Profile
        </Typography>
        <Formik
          initialValues={{
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            department: userDetails.department,
            coursesAssigned: userDetails.coursesAssigned || [],
            officeHours: userDetails.officeHours,
            program: userDetails.program,
            batch: userDetails.batch,
            submit: null,
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            // ... (validation schema)
          })}
          onSubmit={handleSubmit}
        >

          {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              {/* First Name Field */}
              <FormControl fullWidth error={Boolean(touched.firstName && errors.firstName)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-firstName-login">Change First Name</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-firstName-login"
                  type="text"
                  value={values.firstName}
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  label="Change First Name"
                  inputProps={{}}
                />
                {touched.firstName && errors.firstName && (
                  <FormHelperText error id="standard-weight-helper-text-firstName-login">
                    {errors.firstName}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Last Name Field */}
              <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-lastName-login">Change Last Name</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-lastName-login"
                  type="text"
                  value={values.lastName}
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  label="Change Last Name"
                  inputProps={{}}
                />
                {touched.lastName && errors.lastName && (
                  <FormHelperText error id="standard-weight-helper-text-lastName-login">
                    {errors.lastName}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-email-login">Email</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Change Email"
                  inputProps={{ disabled: true }}
                />
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </FormControl>
              {/* Department Field */}
              {(role === 'Professor' || role === 'TA') && <FormControl fullWidth error={Boolean(touched.department && errors.department)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-department">Department</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-department"
                  type="text"
                  value={values.department}
                  name="department"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Department"
                  inputProps={{ disabled: true }}

                />
              </FormControl>}
              {role === 'Student' && <FormControl fullWidth error={Boolean(touched.department && errors.department)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-department">Program</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-department"
                  type="text"
                  value={values.program}
                  name="degree"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Program"
                  inputProps={{ disabled: true }}

                />
              </FormControl>}
              {(role === 'Student' || role === 'TA') && <FormControl fullWidth error={Boolean(touched.department && errors.department)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-department">Batch</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-department"
                  type="text"
                  value={values.batch}
                  name="degree"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Batch"
                  inputProps={{ disabled: true }}

                />
              </FormControl>}


              {/* New Field for Change Course */}
              {role === 'Professor' || role === 'TA' ? (
                <FormControl fullWidth error={Boolean(touched.course && errors.course)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-course">Change Course</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-course"
                    type="text"
                    value={values.coursesAssigned}
                    name="coursesAssigned"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    label="Change Course"
                    inputProps={{}}
                  />
                  {touched.course && errors.course && (
                    <FormHelperText error id="standard-weight-helper-text-course">
                      {errors.course}
                    </FormHelperText>
                  )}
                </FormControl>
              ) : null}

              {/* Office Hours Field */}
              {role === 'Professor' || role === 'TA' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '16px' }}>
                      <InputLabel id="day-label">Days</InputLabel>
                      <Select
                        labelId="day-label"
                        style={{ minWidth: '150px' }}
                        label="Day"
                        onChange={(e) => setOfhr((prev) => ({ ...prev, day: e.target.value }))}
                        value={ofhr.day}
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((i, index) => (
                          <MenuItem key={index} value={i}>{i}</MenuItem>
                        ))}
                      </Select>
                    </div>

                    <div style={{ marginRight: '16px' }}>
                      <InputLabel id="hours-label">Hours</InputLabel>
                      <Select
                        labelId="hours-label"
                        style={{ minWidth: '150px' }}
                        label="Hours"
                        onChange={(e) => setOfhr((prev) => ({ ...prev, slot: e.target.value }))}
                        value={ofhr.slot}
                      >
                        {["8:30 - 9:45", "10:00 - 11:15", "11:30 - 12:45", "13:00 - 14:15", "14:30 - 15:45", "16:00 - 17:15"].map((i, index) => (
                          <MenuItem key={index} value={i}>{i}</MenuItem>
                        ))}
                      </Select>
                    </div>

                    <Button
                      variant="contained"
                      onClick={() => {
                        if (values.officeHours.filter((i) => i.day === ofhr.day && i.slot === ofhr.slot).length === 0) {
                          setFieldValue("officeHours", [...values.officeHours, ofhr]);
                          setOfhr({ day: "", slot: "" });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  <ul>
                    {values.officeHours.map((i, index) => (
                      <li key={index}>
                        {i.day} | {i.slot}{' '}
                        <Button
                          onClick={() =>
                            setFieldValue(
                              "officeHours",
                              values.officeHours.filter((o) => JSON.stringify(o) !== JSON.stringify(i))
                            )
                          }
                        >
                          X
                        </Button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null
              }
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
        </Formik >
      </>
    </Container>
  );
};

export default Edit_page;
