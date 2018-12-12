import * as React from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { functions } from 'firebase';
import { List, ListItem, ListItemText } from '@material-ui/core';

import { useSession } from '../providers/Session';
import AppBar from '../components/AppBar';
import SocialIcon from '../components/SocialIcon';
import { User } from '../types';

interface ComponentProps {
  session: firebase.User | null;
}

type Props = ComponentProps & RouteComponentProps<any, StaticContext, any>;

export default useSession((props: Props) => {
  const { userId } = props.match.params;

  const [user, setUser] = React.useState<User | null>(null);
  const [needPermission, setNeedPermission] = React.useState<Boolean>(false);

  React.useEffect(
    () => {
      functions()
        .httpsCallable('getUserByID')({ uid: userId })
        .then(result => setUser(result.data))
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
});
