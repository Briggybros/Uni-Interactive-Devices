import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import AppBar from '../components/AppBar';
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
} from '@material-ui/core';
import { Person, Delete } from '@material-ui/icons';

import { State as Store, UserRecord, deleteUser } from '../reducer';

interface Props {
  contacts: UserRecord[];
  deleteUser: (userId: string) => void;
}

const ContactsList = (props: Props) => (
  <>
    <AppBar title="Contacts" />
    <List>
      {props.contacts.map(contact => (
        <ListItem
          key={contact.userId}
          component={(props: any) => (
            <Link to={`/${contact.userId}`} {...props} />
          )}
        >
          <Avatar>
            <Person />
          </Avatar>
          <ListItemText primary={contact.fullName} />
          <IconButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              props.deleteUser(contact.userId);
            }}
          >
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  </>
);

export default connect(
  (store: Store) => ({
    contacts: Object.values(store.contacts).sort(
      (a, b) => b.connectTime - a.connectTime
    ),
  }),
  { deleteUser }
)(ContactsList);
