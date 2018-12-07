import * as React from 'react';
import { auth } from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import AppBar from '../components/AppBar';

export default () => (
  <>
    <AppBar title="Login" back />
    <StyledFirebaseAuth
      uiConfig={{
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [
          auth.EmailAuthProvider.PROVIDER_ID,
          auth.GoogleAuthProvider.PROVIDER_ID,
          auth.FacebookAuthProvider.PROVIDER_ID,
          auth.GithubAuthProvider.PROVIDER_ID,
        ],
      }}
      firebaseAuth={auth()}
    />
  </>
);
