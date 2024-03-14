import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography,
 
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';

// ============================|| FIREBASE - LOGIN ||============================ //

const Viewprofile = ({ ...others }) => {
const theme = useTheme();
let fname = useSelector(state => state.user.userDetails.firstName) ;
let lname = useSelector(state => state.user.userDetails.lastName) ;
let fullname = fname + " "+ lname;
let email = useSelector(state => state.user.userDetails.email) ;
let role = useSelector(state => state.user.userDetails.role) ;
let program =  useSelector(state => state.user.userDetails.program) ;

let department =  useSelector(state => state.user.userDetails.department) ;
let Batch =  useSelector(state => state.user.userDetails.batch) ;
let officehours =useSelector(state => state.user.userDetails.officeHours) ;
let courses = useSelector(state => state.user.userDetails.coursesAssigned) ;


 

  return (
    <>
      <Typography variant="h4" mb={4} color="black" textAlign="center" sx={{ fontSize: '2.5rem' }}>
        View Your Profile
      </Typography>
      <Formik
        initialValues={{
          fullName: fullname,
          email: email,
          officeHoursStart: officehours,
          course : courses,
          department: department,
          degree : program,
          batch : Batch,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          fullName: Yup.string().max(255),
          email: Yup.string().email('Must be a valid email').max(255),
          officeHoursStart: Yup.string().max(255),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // Your submission logic goes here
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.fullName && errors.fullName)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-fullName-login">Full Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-fullName-login"
                type="text"
                value={values.fullName}
                name="fullName"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Change Full Name"
                inputProps={{ disabled: true }}
              />
              {touched.fullName && errors.fullName && (
                <FormHelperText error id="standard-weight-helper-text-fullName-login">
                  {errors.fullName}
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
            {(role === 'Professor' || role ==='TA') && <FormControl fullWidth error={Boolean(touched.department && errors.department)} sx={{ ...theme.typography.customInput }}>
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
              <InputLabel htmlFor="outlined-adornment-department">Degree</InputLabel>
              <OutlinedInput
                id="outlined-adornment-department"
                type="text"
                value={values.degree}
                name="degree"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Program"
                inputProps={{ disabled: true }}
                
              />
            </FormControl>}
            {role === 'Student' && <FormControl fullWidth error={Boolean(touched.department && errors.department)} sx={{ ...theme.typography.customInput }}>
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
             {/* New Field for Course */}
             {(role === 'Professor' || role ==='TA') &&  <FormControl fullWidth error={Boolean(touched.course && errors.course)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-course">Course</InputLabel>
              <OutlinedInput
                id="outlined-adornment-course"
                type="text"
                value={values.course}
                name="course"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Change Course"
                inputProps={{ disabled: true }}
              />
              {touched.course && errors.course && (
                <FormHelperText error id="standard-weight-helper-text-course">
                  {errors.course}
                </FormHelperText>
              )}
            </FormControl> }

            {/* Office Hours Field */}
           {  (role === 'Professor' || role ==='TA') &&  <FormControl fullWidth error={Boolean(touched.officeHoursStart && errors.officeHoursStart)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-officeHoursStart-login">Office Hours</InputLabel>
              <OutlinedInput
                id="outlined-adornment-officeHoursStart-login"
                type="text"
                value={values.officeHoursStart}
                name="officeHoursStart"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Change Office Hours"
                inputProps={{ disabled: true }}
              />
              {touched.officeHoursStart && errors.officeHoursStart && (
                <FormHelperText error id="standard-weight-helper-text-officeHoursStart-login">
                  {errors.officeHoursStart}
                </FormHelperText>
              )}
            </FormControl>}
            <Link to="/Edit_page">
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                Change Details 
                </Button>
              </AnimateButton>
            </Box>
            </Link>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Viewprofile;
