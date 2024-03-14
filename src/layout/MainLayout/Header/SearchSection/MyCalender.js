// MyCalendar.js
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import MainCard from 'ui-component/cards/MainCard';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect } from 'react';
import WithModal from 'ui-component/WithModal';
import { Box, Button, ButtonGroup, Chip, Typography, CardContent } from '@mui/material';
// import { useFetchAppointments } from './Api';
import httpService, { endpoints } from 'utils/httpService';
import { useMemo } from 'react';

const localizer = momentLocalizer(moment);

const Event = ({ event }) => {
  return (
    <Box sx={{ padding: "0px 10px", backgroundColor: event.completed ? "green" : event.cancelled ? "red" : "yellow" }}>
      <Typography sx={{ color: event.completed || event.cancelled ? "white" : "black", }}>{event.description}</Typography>
    </Box>
  )
}

const MyCalendar = (props) => {
  //   const { searchResults, fetchAppointments } = useFetchAppointments(props.userId);

  const { components } = useMemo(
    () => ({
      components: {
        event: Event,
      }
    }),
    []
  )

  return (
    <MainCard content={false}>
      <CardContent>
        <Calendar
          components={components}
          // dayPropGetter={dayPropGetter}
          localizer={localizer}
          events={props.events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => {
            props.openModal({
              bodyComp: (
                <Box>
                  <Typography sx={{ mb: 1 }} variant="h4">
                    Description: {event.description}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'success.dark' }}>
                    {event.fromDate?.split('.')[0].replace('T', ' ')} - {event.toDate?.split('T')[1]}
                  </Typography>
                  <Typography variant="subtitle1">
                    Appointer: {event.appointer?.firstName || ''} {event.appointer?.lastName || ''}
                  </Typography>
                  <Typography variant="subtitle1">
                    Appointee: {event.appointee?.firstName || ''} {event.appointee?.lastName || ''}
                  </Typography>
                  <Chip
                    sx={{ mr: 1, color: 'white', backgroundColor: 'darkOrange' }}
                    label={`${event.confirmed === 2 ? '' : 'Not'} confirmed by teacher`}
                  />
                  <Chip sx={{ mr: 1, color: 'white', backgroundColor: 'blue' }} label={`${event.completed ? '' : 'Not yet'} completed`} />
                  <Chip color="error" sx={{ mr: 1, color: 'white' }} label={`${event.cancelled ? '' : 'Not yet'} cancelled`} />
                  <br />
                  <Button
                    sx={{ mt: 1 }}
                    variant="contained"
                    onClick={async () => {
                      const res = await httpService({
                        base: endpoints.appointments.base,
                        endpoint: endpoints.appointments.update,
                        reqBody: {
                          id: event._id,
                          cancelled: true
                        },
                        successNotif: true
                      });
                      if (res) {
                        await props.getData();
                        props.closeModal();
                      }
                    }}
                    color="error"
                  >
                    Cancel appointment
                  </Button>
                  <Button
                    sx={{ mt: 1, ml: 1, color: 'white' }}
                    variant="contained"
                    onClick={async () => {
                      const res = await httpService({
                        base: endpoints.appointments.base,
                        endpoint: endpoints.appointments.update,
                        reqBody: {
                          id: event._id,
                          completed: true
                        },
                        successNotif: true
                      });
                      if (res) {
                        await props.getData();
                        props.closeModal();
                      }
                    }}
                    color="success"
                  >
                    Mark as completed
                  </Button>
                </Box>
              ),
              title: 'Appointment Details'
            });
          }}
        />
      </CardContent>
    </MainCard>
  );
};

export default WithModal(MyCalendar);
