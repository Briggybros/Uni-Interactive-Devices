import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
} from '@material-ui/core';
import { Person, Delete } from '@material-ui/icons';

import { useSession } from '../providers/Session';
import AppBar from '../components/AppBar';
import Login from '../components/Login';
import { User } from '../types';

async function deleteContact(userId: string, contactId: string) {
  const response = await fetch(
    `https://us-central1-amulink-42370.cloudfunctions.net/api/users/${userId}/contacts/${contactId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Error getting contact');
  }

  return await response.json();
}

interface Props {
  session: firebase.User;
}

export default useSession(({ session }: Props) => {
  const [contacts, setContacts] = React.useState<{ [userId: string]: User }>(
    {}
  );

  React.useEffect(
    () => {
      if (session) {
        fetch(
          `https://us-central1-amulink-42370.cloudfunctions.net/api/users/${
            session.uid
          }/contacts`
        )
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Error getting contacts');
          })
          .then(body => {
            return setContacts(body);
          })
          .catch(console.error);
      }
    },
    [contacts]
  );

  return (
    <>
      <AppBar title="Contacts" />
      {!!session ? (
        <List>
          {Object.entries(contacts).map(([userId, user]) => (
            <ListItem
              key={userId}
              component={(props: any) => (
                <Link to={`/u/${userId}`} {...props} />
              )}
            >
              <Avatar>
                <Person />
              </Avatar>
              <ListItemText primary={user.displayName} />
              <IconButton
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteContact(session.uid, userId).then(setContacts);
                }}
              >
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Login text="Please log in to view contacts" />
      )}
    </>
  );
});
