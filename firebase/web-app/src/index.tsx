import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { initializeApp } from 'firebase';

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

const mount = document.getElementById('app');

render(
  <SessionProvider>
    <Router>
      <Switch>
        <Route exact path="/" component={ContactsList} />
        <Route path="/u/:userId" component={Profile} />
        <Route
          path="/b/:badgeId"
          render={({ match }) => {
            fetch(
              `https://us-central1-amulink-42370.cloudfunctions.net/api/user/badge/${
                match.params.badgeId
              }`,
              {
                mode: 'no-cors',
                credentials: 'include',
                redirect: 'follow',
              }
            );
            return null;
          }}
        />
      </Switch>
    </Router>
  </SessionProvider>,
  mount
);
