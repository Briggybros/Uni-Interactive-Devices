import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Link, validateUser, validateLink } from '../../../common/types';

const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true,
});

const api = express();
api.use(bodyParser.json());

api.get('/', (_, res) => {
  return res.sendStatus(200);
});

/* USERS COLLECTION */
api.post('/users', async (req, res) => {
  const user = validateUser(req.body, false);
  return res.sendStatus(200);

  // if (!user) {
  //   return res.status(400).send('Body is not a valid user');
  // }

  // try {
  //   const users = db.collection('users');
  //   const userRef = await users.add(user);
  //   return res.send({ id: userRef.id, ...user });
  // } catch (error) {
  //   return res.status(500).send(error);
  // }
});

api.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  return res.sendStatus(200);

  // try {
  //   const users = db.collection('users');
  //   return res.send('Got users');
  //   const userRef = users.doc(id);
  //   return res.send('Got user ref');
  //   const user = await userRef.get();
  //   if (!user.exists) return res.sendStatus(404);
  //   return res.send(user.data());
  // } catch (error) {
  //   res.status(500).send(error);
  // }
  // return db
  //   .collection('users')
  //   .doc(id)
  //   .get()
  //   .then(doc => (doc.exists ? res.send(doc.data()) : res.sendStatus(404)))
  //   .catch(error => res.status(500).send(error));
});

api.put('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const user = req.body;
  return res.sendStatus(200);
  // if (!data[userId]) {
  //   return res.sendStatus(404);
  // }
  // if (!user) {
  //   return res.sendStatus(400);
  // }
  // data[userId] = {
  //   userId,
  //   fullName: user.fullName || data[userId].fullName,
  //   links: user.links || data[userId].links,
  // };
  // return res.send(JSON.stringify(data[userId]));
});

api.delete('/users/:userId', (req, res) => {
  const { userId }: { userId: string } = req.params;
  return res.sendStatus(200);
  // const user = data[userId];
  // if (!user) return res.sendStatus(404);
  // const { [userId]: killed, ...newData } = data;
  // data = newData;
  // return res.sendStatus(200);
});

/* USER'S LINK COLLECTION */
api.get('/users/:userId/links', (req, res) => {
  const { userId } = req.params;
  return res.sendStatus(200);
  // const user = data[userId];
  // if (!user) return res.sendStatus(404);
  // return res.send(JSON.stringify(user.links));
});

api.post('/users/:userId/links', (req, res) => {
  const { userId } = req.params;
  const link = validateLink(req.body);
  return res.sendStatus(200);
  // const user = data[userId];
  // if (!user) return res.sendStatus(404);
  // if (!link) return res.sendStatus(400);
  // data[userId].links = [...data.user.links, link];
  // return res.status(201).send(JSON.stringify(link));
});

api.get('/users/:userId/links/:name', (req, res) => {
  const { userId, name } = req.params;
  return res.sendStatus(200);
  // const user = data[userId];
  // if (!user) return res.sendStatus(404);
  // const link = user.links.find(link => link.name === name);
  // if (!link) return res.sendStatus(404);
  // return res.send(JSON.stringify(link));
});

api.put('/users/:userId/links/:name', (req, res) => {
  const { userId, name } = req.params;
  const newLink: Link = { name, link: req.body.link };
  return res.sendStatus(200);
  // const user = data[userId];
  // if (!user) return res.sendStatus(404);
  // const link = user.links.find(link => link.name === name);
  // if (!link) return res.sendStatus(404);
  // data[userId].links = data[userId].links.map(link =>
  //   link.name === name ? newLink : link
  // );
  // return res.send(JSON.stringify(newLink));
});

api.delete('/users/:userId/links/:name', (req, res) => {
  const { userId, name } = req.params;
  return res.sendStatus(200);
  // const user = data[userId];
  // if (!user) return res.sendStatus(404);
  // const link = user.links.find(link => link.name === name);
  // if (!link) return res.sendStatus(404);
  // data[userId].links = user.links.filter(link => link.name !== name);
  // return res.sendStatus(200);
});

export default api;
