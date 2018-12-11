import * as admin from 'firebase-admin';
import { validateUser } from './types';

export function onUserCreate(db: FirebaseFirestore.Firestore) {
  return async (userRecord: admin.auth.UserRecord) => {
    const uUser = {
      displayName: userRecord.displayName,
      links: [],
      private: false,
      whitelist: [],
      requests: [],
      contacts: [],
    };

    const user = validateUser(uUser);

    if (!user) {
      console.error('Signin created a bad user: ', uUser);
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

export function onUserDelete(db: admin.firestore.Firestore) {
  return async (userRecord: admin.auth.UserRecord) => {
    try {
      await db
        .collection('users')
        .doc(userRecord.uid)
        .delete();
      return true;
    } catch (error) {
      console.error('Failed to delete user from database');
      return false;
    }
  };
}
