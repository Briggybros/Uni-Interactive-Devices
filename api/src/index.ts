import * as path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import uuidv4 from 'uuid/v4';

import { User, Link } from '../../common/types';

// @ts-ignore
import demoData from './demo.json';

const PORT = process.env.PORT || 8081;

let data: { [userId: string]: User } = demoData;

function validateUser(user: any): User | null {
  if (
    typeof user === 'object' &&
    !!user.userId &&
    typeof user.userId === 'string' &&
    !!user.fullName &&
    typeof user.fullName === 'string' &&
    !!user.links &&
    Array.isArray(user.links) &&
    (user.links as any[]).every(link => !!validateLink(link))
  ) {
    return user as User;
  }
  return null;
}

function validateLink(link: any): Link | null {
  if (
    typeof link === 'object' &&
    !!link.name &&
    typeof link.name === 'string' &&
    !!link.link &&
    typeof link.link === 'string'
  ) {
    return link as Link;
  }
  return null;
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* USERS COLLECTION */
app.post('/users', (req, res) => {
  const user = validateUser(req.body);

  if (!user) {
    return res.sendStatus(400);
  }

  const uuid = uuidv4();

  data = {
    ...data,
    [uuid]: user,
  };

  return res.status(201).send(
    JSON.stringify({
      uuid,
      user,
    })
  );
});

app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const user = data[userId];

  if (!user) return res.sendStatus(404);

  return res.send(JSON.stringify(user));
});

app.put('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const user = req.body;

  if (!data[userId]) {
    return res.sendStatus(404);
  }

  if (!user) {
    return res.sendStatus(400);
  }

  data[userId] = {
    userId,
    fullName: user.fullName || data[userId].fullName,
    links: user.links || data[userId].links,
  };

  return res.send(JSON.stringify(data[userId]));
});

app.delete('/users/:userId', (req, res) => {
  const { userId }: { userId: string } = req.params;
  const user = data[userId];

  if (!user) return res.sendStatus(404);

  const { [userId]: killed, ...newData } = data;

  data = newData;

  return res.sendStatus(200);
});

/* USER'S LINK COLLECTION */
app.get('/users/:userId/links', (req, res) => {
  const { userId } = req.params;
  const user = data[userId];

  if (!user) return res.sendStatus(404);

  return res.send(JSON.stringify(user.links));
});

app.post('/users/:userId/links', (req, res) => {
  const { userId } = req.params;
  const user = data[userId];
  const link = validateLink(req.body);

  if (!user) return res.sendStatus(404);
  if (!link) return res.sendStatus(400);

  data[userId].links = [...data.user.links, link];

  return res.status(201).send(JSON.stringify(link));
});

app.get('/users/:userId/links/:name', (req, res) => {
  const { userId, name } = req.params;
  const user = data[userId];

  if (!user) return res.sendStatus(404);

  const link = user.links.find(link => link.name === name);

  if (!link) return res.sendStatus(404);

  return res.send(JSON.stringify(link));
});

app.put('/users/:userId/links/:name', (req, res) => {
  const { userId, name } = req.params;
  const newLink: Link = { name, link: req.body.link };
  const user = data[userId];

  if (!user) return res.sendStatus(404);

  const link = user.links.find(link => link.name === name);

  if (!link) return res.sendStatus(404);

  data[userId].links = data[userId].links.map(link =>
    link.name === name ? newLink : link
  );

  return res.send(JSON.stringify(newLink));
});

app.delete('/users/:userId/links/:name', (req, res) => {
  const { userId, name } = req.params;
  const user = data[userId];

  if (!user) return res.sendStatus(404);

  const link = user.links.find(link => link.name === name);

  if (!link) return res.sendStatus(404);

  data[userId].links = user.links.filter(link => link.name !== name);

  return res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`));
