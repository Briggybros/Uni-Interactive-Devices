import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Profile from './Profile';

const mount = document.getElementById('app');

const ProfileLoader = props => {
  const userId = props.match.params.userId;
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    fetch(`/${userId}`, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          return console.error(`Failed to find user with id: ${userId}`);
        }
        return response.json();
      })
      .then(body => {
        setProfile(body);
      })
      .catch(console.error);
  });

  return <Profile user={profile} />;
};

render(
  <Router>
    <Route path="/:userId" component={ProfileLoader} />
  </Router>,
  mount
);
