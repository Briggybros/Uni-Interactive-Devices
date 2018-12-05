import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Link, validateUser, validateLink } from './types';

export default function api(db: FirebaseFirestore.Firestore) {
  const api = express();
  api.use(bodyParser.json());

  api.get('/', (_, res) => {
    return res.sendStatus(200);
  });

  /* USERS COLLECTION */
  api.post('/users', async (req, res) => {
    const user = validateUser(req.body, false);

    if (!user) {
      return res.status(400).send('Body is not a valid user');
    }

    try {
      const users = db.collection('users');
      const userRef = await users.add(user);
      return res.send({ id: userRef.id, ...user });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  api.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const user = await db
        .collection('users')
        .doc(id)
        .get();
      if (!user.exists) return res.sendStatus(404);
      return res.send({ id, ...user.data() });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  api.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const newUser = validateUser(req.body, false);

    try {
      const userRecord = await db.collection('users').doc(id);

      if (!newUser) return res.status(400).send('Body is not a valid user');
      if (!(await userRecord.get()).exists) return res.sendStatus(404);

      await userRecord.update({ ...newUser });

      return res.send({ id, ...(await userRecord.get()).data() });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  api.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const userRecord = await db.collection('users').doc(id);

      if (!(await userRecord.get()).exists) return res.sendStatus(404);

      await userRecord.delete();

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  /* USER'S LINK COLLECTION */
  api.get('/users/:id/links', async (req, res) => {
    const { id } = req.params;

    try {
      const user = await db
        .collection('users')
        .doc(id)
        .get();

      if (!user.exists) return res.sendStatus(404);

      return res.send((await user.data()).links);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  api.post('/users/:id/links', async (req, res) => {
    const { id } = req.params;
    const { name, url } = validateLink(req.body);

    try {
      const userRecord = db.collection('users').doc(id);

      if (!(await userRecord.get()).exists) return res.sendStatus(404);

      if (
        ((await userRecord.get()).data().links as Link[]).reduce(
          (acc, l) => acc + (l.name === name ? 1 : 0),
          0
        ) > 1
      )
        return res.status(400).send('A link already exists with that name');

      const newLinks = [
        ...(await userRecord.get()).data().links,
        { name, url },
      ];

      await userRecord.update({ links: newLinks });

      return res.send({ id, ...(await userRecord.get()).data() });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  api.get('/users/:id/links/:name', async (req, res) => {
    const { id, name } = req.params;

    try {
      const userRecord = db.collection('users').doc(id);

      if (!(await userRecord.get()).exists) return res.sendStatus(404);

      const link = ((await userRecord.get()).data().links as Link[]).find(
        l => l.name === name
      );

      if (!link) return res.sendStatus(404);

      return res.send(link);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  api.put('/users/:id/links/:name', async (req, res) => {
    const { id, name } = req.params;
    const newLinkURL: string = req.body.url;

    try {
      const userRecord = db.collection('users').doc(id);

      if (!(await userRecord.get()).exists) return res.sendStatus(404);

      const links = ((await userRecord.get()).data().links as Link[]).map(l =>
        l.name === name ? { ...l, url: newLinkURL } : l
      );

      await userRecord.update({ links });

      return res.send(
        ((await userRecord.get()).data().links as Link[]).find(
          l => l.name === name
        )
      );
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  api.delete('/users/:id/links/:name', async (req, res) => {
    const { id, name } = req.params;

    try {
      const userRecord = db.collection('users').doc(id);

      if (!(await userRecord.get()).exists) return res.sendStatus(404);

      const link = ((await userRecord.get()).data().links as Link[]).find(
        l => l.name === name
      );

      if (!link) return res.sendStatus(404);

      const newLinks = ((await userRecord.get()).data().links as Link[]).filter(
        l => l.name !== name
      );

      await userRecord.update({ links: newLinks });

      return res.send((await userRecord.get()).data().links);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  return api;
}
