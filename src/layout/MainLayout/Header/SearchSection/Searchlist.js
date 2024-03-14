import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Button,
  Popover,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import WithModal from 'ui-component/WithModal';
import * as Yup from "yup";
import moment from 'moment';
import { Formik } from 'formik';
import httpService, { endpoints } from 'utils/httpService';

const dateFormat = "yyyy-MM-DD HH:mm:ss"

const Searchlist = (props) => {
  const loc = useLocation();
  const nav = useNavigate();
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverContent, setPopoverContent] = useState(null);

  const handlePopoverOpen = (event, content) => {
    setPopoverAnchor(event.currentTarget);
    setPopoverContent(content);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setPopoverContent(null);
  };

  const renderExtraItems = () => (
    <Popover
      open={Boolean(popoverAnchor)}
      anchorEl={popoverAnchor}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box p={2}>
        {popoverContent?.map((item, index) => (
          <Typography key={index}>{item}</Typography>
        ))}
      </Box>
    </Popover>
  );

  const bookAppointment = (item) => {
    props.openModal({
      bodyComp: <BookAppointmentForm item={item} closeModal={props.closeModal} />,
      title: "Book appointment",
    })
  }

  return (
    <Grid container spacing={2} style={{ marginTop: '20px' }}>
      {loc.state.res.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card>
            {/* Profile Icon at Center Top */}
            <Avatar
              sx={{
                width: 48,
                height: 48,
                margin: 'auto',
                marginTop: '16px',
              }}
            >
              {/* You can use an actual profile icon or an image here */}
              P
            </Avatar>
            <CardContent style={{ textAlign: 'center' }}>
              <Typography variant="h5" style={{ fontSize: '1.5rem' }}>
                {item.firstName} {item.lastName}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" style={{ fontSize: '1.2rem' }}>
                {item.department}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Office Hours:</strong>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {item.officeHours
                    .slice(0, 2)
                    .map((i, j) => (
                      <Chip key={j} label={`${i.day} | ${i.slot}`} variant="outlined" shape="rounded" />
                    ))}
                  {item.officeHours.length > 2 && (
                    <Chip
                      label={`+${item.officeHours.length - 2}`}
                      variant="outlined"
                      shape="rounded"
                      onClick={(event) => handlePopoverOpen(event, item.officeHours.slice(2).map(i => `${i.day} | ${i.slot}`))}
                      sx={{ cursor: 'pointer' }}
                    />
                  )}
                </div>
              </Typography>

              <Typography variant="subtitle1">
                <strong>Courses Assigned:</strong>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {item.coursesAssigned[0].split(",").map(i=>i.trim())
                    .slice(0, 2)
                    .map((course, courseIndex) => (
                      <Chip key={courseIndex} label={course} variant="outlined" shape="rounded" />
                    ))}
                  {item.coursesAssigned[0].split(",").map(i=>i.trim()).length > 2 && (
                    <>
                    <Chip
                      label={`+${item.coursesAssigned[0].split(",").map(i=>i.trim()).length - 2}`}
                      variant="outlined"
                      shape="rounded"
                      onClick={(event) => handlePopoverOpen(event, item.coursesAssigned[0].split(",").map(i=>i.trim()).slice(2))}
                      sx={{ cursor: 'pointer' }}
                    />
                    </>
                  )}
                </div>
              </Typography>

              <Button variant="contained" color="primary" onClick={() => bookAppointment(item)} sx={{ marginTop: '10px' }}>
                Book appointment
              </Button>
            </CardContent>
            {item.officeHours.length > 2 && renderExtraItems()}
            {item.coursesAssigned[0].split(",").map(i=>i.trim()).length > 2 && renderExtraItems()}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default WithModal(Searchlist);

const BookAppointmentForm = ({ item, closeModal }) => {
  return (
    <Box>
      <Formik
        initialValues={{
          description: "",
          date: moment().format(dateFormat)
        }}
        validationSchema={Yup.object().shape({
          description: Yup.string().max(255).required('Description is required'),
          date: Yup.string().oneOf(item.officeHours.map(i => JSON.stringify(i)), "Please choose slot").required("Slot is required")
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: true });
            setSubmitting(false);
            const { day, slot } = JSON.parse(values.date);
            const times = slot.split(" - ");

            const currentMoment = moment();
            const nextOccurrence = currentMoment.clone().day(day);
            if (nextOccurrence.isSameOrBefore(currentMoment)) nextOccurrence.add(1, 'weeks');
            const fromDate = nextOccurrence.clone().set({ hour: moment(times[0], 'HH:mm').hour(), minute: moment(times[0], 'HH:mm').minute() });
            const toDate = nextOccurrence.clone().set({ hour: moment(times[1], 'HH:mm').hour(), minute: moment(times[1], 'HH:mm').minute() });

            const res = await httpService({
              base: endpoints.appointments.base,
              endpoint: endpoints.appointments.create,
              reqBody: {
                appointee: item._id,
                description: values.description,
                fromDate: fromDate.format("yyyy-MM-DDTHH:mm:ss"),
                toDate: toDate.format("yyyy-MM-DDTHH:mm:ss")
              },
              successNotif: true
            })
            if (res) closeModal()
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormControl fullWidth error={Boolean(touched.description && errors.description)} >
              <InputLabel htmlFor="outlined-adornment-email-login">Description</InputLabel>
              <OutlinedInput
                value={values.description}
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Description for appointment"
              />
              {touched.description && errors.description && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.description}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Select time slot</FormLabel>
              <RadioGroup name="date" onChange={(e, v) => setFieldValue("date", v)}>
                {item.officeHours?.map(i => <FormControlLabel value={JSON.stringify(i)}
                  control={<Radio />} label={`${i.day} - ${i.slot}`} />)}
              </RadioGroup>
            </FormControl>
            {touched.date && errors.date && (
              <FormHelperText error id="standard-weight-helper-text-email-login">
                {errors.date}
              </FormHelperText>
            )}
            <Box sx={{ mt: 2 }}>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                Book
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box >
  )
}