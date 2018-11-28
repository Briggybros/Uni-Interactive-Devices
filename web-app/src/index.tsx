import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

import ContactsList from './views/ContactsList';
import Profile from './views/Profile';

import reducer from './reducer';

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
          <Route path="/:userId" component={Profile} />
        </Switch>
      </Router>
    </PersistGate>
  </ReduxProvider>,
  mount
);
