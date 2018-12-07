import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { initializeApp, auth } from 'firebase';

import ContactsList from './views/ContactsList';
import Login from './views/Login';
import Profile from './views/Profile';

initializeApp({
  apiKey: 'AIzaSyDVROG8TY8XNQSGSc9RbdCV0mM5mDK-fUU',
  authDomain: 'amulink-42370.firebaseapp.com',
  databaseURL: 'https://amulink-42370.firebaseio.com',
  projectId: 'amulink-42370',
  storageBucket: 'amulink-42370.appspot.com',
  messagingSenderId: '151350003330',
});

let uid: string | null = null;

auth().onAuthStateChanged(user => {
  if (user) {
    uid = user.uid;
  } else {
    uid = null;
  }
});

const mount = document.getElementById('app');

render(
  <Router>
    <Switch>
      <Route exact path="/">
        <ContactsList uid={uid} />
      </Route>
      <Route path="/login" component={Login} />
      <Route
        path="/:userId"
        render={renderProps => <Profile uid={uid} {...renderProps} />}
      />
    </Switch>
  </Router>,
  mount
);
