import * as React from 'react';
import { auth } from 'firebase';

const SessionContext = React.createContext<firebase.User | null>(null);

export const SessionProvider = ({ ...props }) => {
  const [user, setUser] = React.useState<firebase.User | null>(
    auth().currentUser
  );

  auth().onAuthStateChanged(u => (u ? setUser(u) : setUser(null)));

  return <SessionContext.Provider value={user} {...props} />;
};

export function useSession(Component: any) {
  return (props: { [key: string]: any }) => (
    <SessionContext.Consumer>
      {session => <Component session={session} {...props} />}
    </SessionContext.Consumer>
  );
}
