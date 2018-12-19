import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { initializeApp, functions } from 'firebase';
import 'firebase/functions';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import { SessionProvider } from './providers/Session';
import ContactsList from './views/ContactsList';
import Profile from './views/Profile';

initializeApp({
  apiKey: 'AIzaSyDVROG8TY8XNQSGSc9RbdCV0mM5mDK-fUU',
  authDomain: 'amulink-42370.firebaseapp.com',
  databaseURL: 'https://amulink-42370.firebaseio.com',
  projectId: 'amulink-42370',
  storageBucket: 'amulink-42370.appspot.com',
  messagingSenderId: '151350003330',
});
functions();

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f9683a',
      main: '#bf360c',
      dark: '#870000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#8d8d8d',
      main: '#606060',
      dark: '#363636',
      contrastText: '#fff',
    }
  }
});

const mount = document.getElementById('app');

render(
  <MuiThemeProvider theme={theme}>
    <SessionProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={ContactsList} />
          <Route path="/u/:userId" component={Profile} />
          <Route
            path="/b/:badgeId"
            render={({ match }) => {
              functions()
                .httpsCallable('getUserByBadgeID')({
                  id: match.params.badgeId,
                })
                .then(response =>
                  window.location.replace(`/u/${response.data.uid}`)
                )
                .catch(error => {
                  if (error.code === 'not-found') {
                    window.location.replace('/');
                  } else {
                    console.error(error);
                  }
                });
              return null;
            }}
          />
        </Switch>
      </Router>
    </SessionProvider></MuiThemeProvider>
  ,
  mount
);
