import * as React from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

import { User } from '../types';

import { List, ListItem, ListItemText } from '@material-ui/core';

import AppBar from '../components/AppBar';
import SocialIcon from '../components/SocialIcon';

export default (props: RouteComponentProps<any, StaticContext, any>) => {
  const { userId } = props.match.params;

  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(
    () => {
      fetch(
        `https://us-central1-amulink-42370.cloudfunctions.net/api/users/badge/${userId}`
      )
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to find user with id: ${userId}`);
          }
          return response.json();
        })
        .then(body => {
          setUser(body);
        })
        .catch(console.error);
    },
    [userId]
  );

  if (user === null) return <span>Loading...</span>;

  return (
    <>
      <AppBar title={user.displayName} back />
      <List>
        {user.links &&
          user.links.map(link => (
            <ListItem
              key={link.url}
              component={(props: any) => <a href={link.url} {...props} />}
            >
              <SocialIcon type={link.name} />
              <ListItemText primary={`Connect with: ${link.name}`} />
            </ListItem>
          ))}
      </List>
    </>
  );
};
