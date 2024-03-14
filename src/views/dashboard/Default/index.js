import { useEffect, useState } from 'react';
import MyCalendar from 'layout/MainLayout/Header/SearchSection/MyCalender';
import httpService, { endpoints } from 'utils/httpService';
// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './MeetingMainCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import { useSelector } from 'react-redux';

// ==============================|| DEFAULT DASHBOARD ||============================== //


const Dashboard = () => {
  const role = useSelector(state => state.user.userDetails.role)

  const [result, setres] = useState([]);
  const fetchAppointments = async () => {
    try {
      const res = await httpService({
        base: endpoints.appointments.base,
        endpoint: endpoints.appointments.getAll,
      });
      if (res) {
        setres(res.map(event => ({
          title: `${event.description}`,
          start: new Date(event.fromDate),
          end: new Date(event.toDate),
          ...event
        })));
      }
    } catch (error) {
      console.error('Error fetching appointments', error);
      throw error;
    }
  };
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
    fetchAppointments()
  }, []);

  return (
    <Grid container spacing={gridSpacing} style={{ marginTop: '20px' }}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {<Grid item xs={12} md={(role === "TA" || role === "Professor") ? 8 : 12}>
            {/* <TotalGrowthBarChart isLoading={isLoading} /> */}
            <MyCalendar events={result} getData={fetchAppointments} />
          </Grid>}
          {(role === "TA" || role === "Professor") && <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} getData={fetchAppointments} data={result} />
          </Grid>}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
