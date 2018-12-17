import * as React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { ArrowBack, Add } from '@material-ui/icons';

interface Props {
  title: string;
  back?: boolean;
  add?: boolean;
  onAddClick?: () => any;
}

export default ({ title, back, add, onAddClick }: Props) => (
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
      {add && (
        <IconButton color="inherit" onClick={onAddClick} style={{marginLeft: 'auto'}}>
          <Add />
        </IconButton>
      )}
    </Toolbar>
  </AppBar>
);
