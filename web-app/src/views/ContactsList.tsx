import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import AppBar from '../components/AppBar';
import {
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
} from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';

import { State as Store, UserRecord, deleteUser } from '../reducer';

interface Props {
  contacts: UserRecord[];
  deleteUser: (userId: string) => void;
}

const ContactsList = (props: Props) => (
  <>
    <AppBar title="Contacts" />
    <GridList cols={2} cellHeight={200}>
      {props.contacts.map(contact => (
        <GridListTile
          key={contact.userId}
          component={(props: any) => (
            <Link to={`/${contact.userId}`} {...props} />
          )}
        >
          <img src="https://www.runrevel.com/files/imgs/unknown_user.jpg" />
          <GridListTileBar
            title={contact.fullName}
            actionIcon={
              <IconButton
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  props.deleteUser(contact.userId);
                }}
              >
                <DeleteForever />
              </IconButton>
            }
          />
        </GridListTile>
      ))}
    </GridList>
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
