import * as React from 'react';
import { Link } from 'react-router-dom';
import { functions } from 'firebase';
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

async function deleteContact(contactId: string) {
  try {
    return (await functions().httpsCallable('deleteContact')({ contactId }))
      .data;
  } catch (error) {
    console.error(error);
  }
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
        functions()
          .httpsCallable('getContacts')()
          .then(response => {
            return setContacts(response.data.contacts);
          })
          .catch(console.error);
      }
    }, [session]
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
                  deleteContact(userId).then(setContacts);
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
