import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';

import { User } from './types';

export function getUserByID(db: firestore.Firestore) {
  return async (data: any, context: functions.https.CallableContext) => {
    const requestId = context.auth ? context.auth.uid : null;
    const { uid } = data;

    if (!uid)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'uid not provided'
      );

    const userRecord = await db
      .collection('users')
      .doc(uid)
      .get();

    if (!userRecord.exists) throw new functions.https.HttpsError('not-found');

    const user = (await userRecord.data()) as User;

    if (user.private && user.whitelist.indexOf(requestId) === -1)
      throw new functions.https.HttpsError('permission-denied');

    const { displayName, links } = user;

    let requestContacts;

    if (!!requestId) {
      requestContacts = (await db
        .collection('users')
        .doc(requestId)
        .get()).data().contacts as string[];
    } else {
      requestContacts = []
    }


    return {
      displayName,
      links,
      isContact: requestContacts.indexOf(uid) !== -1,
    };
  };
}

export function getUserByBadgeID(db: firestore.Firestore) {
  return async (data: any, context: functions.https.CallableContext) => {
    const { id } = data;

    if (!id)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Id not provided'
      );

    const users = (await db
      .collection('users')
      .where('badgeId', '==', id)
      .get()).docs;

    if (users.length === 0) throw new functions.https.HttpsError('not-found');
    if (users.length > 1)
      throw new functions.https.HttpsError(
        'aborted',
        'More than one user registered to that device ID'
      );

    return {
      uid: users[0].id,
    };
  };
}

export function assignBadgeID(db: firestore.Firestore) {
  return async (data: any, context: functions.https.CallableContext) => {
    const uid = context.auth ? context.auth.uid : null;
    const { id }: { id: string } = data;
    const badgeId = id.toUpperCase();

    if (!uid) throw new functions.https.HttpsError('unauthenticated');
    if (!badgeId)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Id not provided'
      );

    const records = await db
      .collection('users')
      .where('badgeId', '==', badgeId)
      .get();

    records.forEach(record => record.ref.update({ badgeId: null }));

    const userRecord = await db.collection('users').doc(uid);
    await userRecord.update({ badgeId: badgeId });
    return { badgeId: (await userRecord.get()).data().badgeId };
  };
}

export function getContacts(db: firestore.Firestore) {
  return async (_: any, context: functions.https.CallableContext) => {
    const uid = context.auth ? context.auth.uid : null;

    if (!uid) throw new functions.https.HttpsError('unauthenticated');

    const user = await db
      .collection('users')
      .doc(uid)
      .get();

    if (!user.exists) throw new functions.https.HttpsError('data-loss');

    const contactIds = (await user.data()).contacts as string[];
    const contacts = await contactIds.reduce(async (acc, contactId) => ({ ...acc, [contactId]: await getUserByID(db)({ uid: contactId }, context) }), {})

    return {
      contacts,
    };
  };
}

export function addContact(db: firestore.Firestore) {
  return async (data: any, context: functions.https.CallableContext) => {
    const uid = context.auth ? context.auth.uid : null;
    const { contactId } = data;

    if (!uid) throw new functions.https.HttpsError('unauthenticated');
    if (!contactId)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'contactId not provided'
      );

    const userRecord = db.collection('users').doc(uid);

    if (!(await userRecord.get()).exists)
      throw new functions.https.HttpsError('data-loss');

    const newContacts = [
      ...(((await userRecord.get()).data().contacts as string[]).filter(c => c !== contactId)),
      contactId,
    ];

    await userRecord.update({ contacts: newContacts });

    return {
      contacts: (await userRecord.get()).data().contacts,
    };
  };
}

export function deleteContact(db: firestore.Firestore) {
  return async (data: any, context: functions.https.CallableContext) => {
    const uid = context.auth ? context.auth.uid : null;
    const { contactId } = data;

    if (!uid) throw new functions.https.HttpsError('unauthenticated');
    if (!contactId)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'contactId not provided'
      );

    const userRecord = db.collection('users').doc(uid);

    if (!(await userRecord.get()).exists)
      throw new functions.https.HttpsError('data-loss');

    const contact = ((await userRecord.get()).data().contact as string[]).find(
      c => c === contactId
    );

    if (!contact) return new functions.https.HttpsError('not-found');

    const newContacts = ((await userRecord.get()).data()
      .contacts as string[]).filter(c => c !== contactId);

    await userRecord.update({ contacts: newContacts });

    return {
      contacts: (await userRecord.get()).data().contacts,
    };
  };
}
