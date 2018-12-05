import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { initializeApp } from 'firebase';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

import ContactsList from './views/ContactsList';
import Login from './views/Login';
import Profile from './views/Profile';

import reducer from './reducer';

initializeApp({
  apiKey: 'AIzaSyDVROG8TY8XNQSGSc9RbdCV0mM5mDK-fUU',
  authDomain: 'amulink-42370.firebaseapp.com',
  databaseURL: 'https://amulink-42370.firebaseio.com',
  projectId: 'amulink-42370',
  storageBucket: 'amulink-42370.appspot.com',
  messagingSenderId: '151350003330',
});

const persistedReducer = persistReducer({ storage, key: 'root' }, reducer);

const store = createStore(persistedReducer);

const persistor = persistStore(store);

const mount = document.getElementById('app');

render(
  <ReduxProvider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <Switch>
          <Route exact path="/" component={ContactsList} />
          <Route path="/login" component={Login} />
          <Route path="/:userId" component={Profile} />
        </Switch>
      </Router>
    </PersistGate>
  </ReduxProvider>,
  mount
);
