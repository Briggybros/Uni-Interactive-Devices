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

import AppBar from '../components/AppBar';
import { User } from '../types';

function deleteContact(userId: string, contactId: string) {
  return fetch(
    `https://us-central1-amulink-42370.cloudfunctions.net/api/users/${userId}/contacts/${contactId}`,
    {
      method: 'DELETE',
    }
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Error getting contacts');
    })
    .catch(error => console.error(error));
}

interface Props {
  uid: string | null;
}

export default ({ uid }: Props) => {
  const [contacts, setContacts] = React.useState<{ [userId: string]: User }>(
    {}
  );

  React.useEffect(
    () => {
      fetch(
        `https://us-central1-amulink-42370.cloudfunctions.net/api/users/${uid}/contacts`
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
    },
    [contacts]
  );

  return (
    <>
      <AppBar title="Contacts" />
      {!!uid && (
        <List>
          {Object.entries(contacts).map(([userId, user]) => (
            <ListItem
              key={userId}
              component={(props: any) => <Link to={`/${userId}`} {...props} />}
            >
              <Avatar>
                <Person />
              </Avatar>
              <ListItemText primary={user.displayName} />
              <IconButton
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteContact(uid, userId).then(setContacts);
                }}
              >
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};
