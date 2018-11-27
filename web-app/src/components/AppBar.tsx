import * as React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

interface Props {
  title: string;
  back?: boolean;
}

export default ({ title, back }: Props) => (
  <AppBar position="static">
    <Toolbar>
      {back && (
        <IconButton
          color="inherit"
          aria-label="back"
          component={(props: any) => <Link to="/" {...props} />}
        >
          <ArrowBack />
        </IconButton>
      )}
      <Typography variant="h6" color="inherit">
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);
