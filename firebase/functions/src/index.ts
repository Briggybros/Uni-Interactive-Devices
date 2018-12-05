import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import api from './api';

admin.initializeApp();

export const bilal = functions.https.onRequest((req, res) => {
  res.sendStatus(200);
});

export const api2 = functions.https.onRequest(api);
