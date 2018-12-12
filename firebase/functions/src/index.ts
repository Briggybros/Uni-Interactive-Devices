import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { onUserCreate, onUserDelete } from './auth';
import {
  getUserByID,
  getUserByBadgeID,
  getContacts,
  deleteContact,
} from './api';

admin.initializeApp();

const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true,
});

exports.onUserCreate = functions.auth.user().onCreate(onUserCreate(db));
exports.onUserDelete = functions.auth.user().onDelete(onUserDelete(db));

exports.getUserByID = functions.https.onCall(getUserByID(db));
exports.getUserByBadgeID = functions.https.onCall(getUserByBadgeID(db));
exports.getContacts = functions.https.onCall(getContacts(db));
exports.deleteContact = functions.https.onCall(deleteContact(db));
