import * as React from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

import { User } from '../types';

import { List, ListItem, ListItemText } from '@material-ui/core';

import AppBar from '../components/AppBar';
import SocialIcon from '../components/SocialIcon';

interface ComponentProps {
  uid: string | null;
}

type Props = ComponentProps & RouteComponentProps<any, StaticContext, any>;

export default (props: Props) => {
  const { userId } = props.match.params;

  const [user, setUser] = React.useState<User | null>(null);
  const [needPermission, setNeedPermission] = React.useState<Boolean>(false);

  React.useEffect(
    () => {
      fetch(
        `https://us-central1-amulink-42370.cloudfunctions.net/api/users/badge/${userId}${
          !!props.uid ? `?requestId=${props.uid}` : ''
        }`
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          if (response.status === 403) {
            setNeedPermission(true);
            return null;
          }
          throw new Error(`Failed to find user with id: ${userId}`);
        })
        .then(body => {
          if (body) setUser(body);
        })
        .catch(console.error);
    },
    [userId]
  );

  if (user === null) return <span>Loading...</span>;

  if (needPermission) {
    return (
      <span>Need permission - although there's no way to request it yet.</span>
    );
  }

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
