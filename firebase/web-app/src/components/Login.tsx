import * as React from 'react';
import { auth } from 'firebase';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import { Card } from '@material-ui/core';

interface Props {
  text?: string;
}

export default ({ text }: Props) => (
  <Card
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: 'fit-content',
      height: 'fit-content',
      alignSelf: 'center',
      marginTop: 'auto',
      marginBottom: 'auto',
    }}
  >
    {text && (
      <span style={{ alignSelf: 'center', marginTop: '1rem' }}>{text}</span>
    )}
    <FirebaseAuth
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
  </Card>
);
