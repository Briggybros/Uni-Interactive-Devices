import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import api from './api';
import { onUserCreate } from './auth';

admin.initializeApp();

const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true,
});

exports.api = functions.https.onRequest(api(db));
exports.onAuth = functions.auth.user().onCreate(onUserCreate(db));
