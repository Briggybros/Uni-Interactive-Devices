import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, StaticContext } from 'react-router';

import { State as Store, Contacts, addUser, updateUser } from '../reducer';
import AppBar from '../components/AppBar';

import User from '../../../common/user';

interface ProfileProps {
  user: User;
}

const Profile = ({ user }: ProfileProps) => (
  <>
    <AppBar title={user.fullName} back />
  </>
);

interface StoreProps {
  contacts: Contacts;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
}

type WrapperProps = StoreProps & RouteComponentProps<any, StaticContext, any>;

export default connect(
  (store: Store) => ({ contacts: store.contacts }),
  { addUser, updateUser }
)((props: WrapperProps) => {
  const userId = props.match.params.userId;

  React.useEffect(
    () => {
      fetch(`http://localhost:8081/${userId}`, {
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
          if (props.contacts[userId]) {
            props.updateUser(body);
          } else {
            props.addUser(body);
          }
        })
        .catch(console.error);
    },
    [userId]
  );

  return props.contacts[userId] ? (
    <Profile user={props.contacts[userId]} />
  ) : (
    <span>Loading...</span>
  );
});
