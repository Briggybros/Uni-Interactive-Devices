import * as admin from 'firebase-admin';
import { validateUser } from './types';

export function onUserCreate(db: FirebaseFirestore.Firestore) {
  return async (userRecord: admin.auth.UserRecord) => {
    const user = validateUser({
      displayName: userRecord.displayName,
      links: [],
    });

    if (!user) {
      console.error('Signin created a bad user: ', {
        displayName: userRecord.displayName,
        links: [],
      });
      return false;
    }

    try {
      await db
        .collection('users')
        .doc(userRecord.uid)
        .set(user);
      return true;
    } catch (error) {
      console.error('Failed to add user to database');
      return false;
    }
  };
}
