import React from 'react'
import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import moment from "moment";
import httpService, { endpoints } from 'utils/httpService';

const MeetingSubCard = ({ data, getData }) => {
  const theme = useTheme();



  const handleClick = async (i) => {
    const res = await httpService({
      base: endpoints.appointments.base,
      endpoint: endpoints.appointments.update,
      reqBody: {
        id: data._id,
        confirmed: i,
      },
      successNotif: true
    })
    if (res) {
      getData()
    }
  };


  return (
    <CardContent>
      <Grid container spacing={gridSpacing}>
        <Grid container direction="column">
          <Grid item>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="subtitle1" color="inherit">
                  {data.appointer.firstName || "John"} {data.appointer.lastName || "Doe"}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                  <Grid item>
                    <Button variant="contained" color="success" size="small" sx={{ color: "White" }} onClick={() => handleClick(true)}>
                      Done
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="error" size="small" onClick={() => handleClick(false)}>
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" sx={{ color: 'D0D0D0' }}>
              {data.description}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" sx={{ color: 'success.dark' }}>
              {data.fromDate?.split(".")[0].replace("T", " ")} - {data.toDate?.split("T")[1]}
            </Typography>
          </Grid>
          <Divider sx={{ my: 1.5 }} />
        </Grid>

      </Grid>


    </CardContent>
  )
}

export default MeetingSubCard;