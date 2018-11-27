import * as path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import uuidv4 from 'uuid/v4';

import User from '../../common/user';

// @ts-ignore
import demoData from './demo.json';

const PORT = process.env.PORT || 8081;

let data: { [userId: string]: User } = demoData;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const user = data[userId];

  if (!user) {
    return res.sendStatus(404);
  }

  res.send(JSON.stringify(user));
});

function validateUser(user: any): User | null {
  if (typeof user === 'object' && typeof user.fullName === 'string') {
    return user as User;
  }
  return null;
}

app.post('/', (req, res) => {
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

app.put('/:userId', (req, res) => {
  const { userId } = req.params;

  if (!data[userId]) {
    return res.sendStatus(404);
  }

  const user = validateUser(req.body);

  if (!user) {
    return res.sendStatus(400);
  }

  data[userId] = user;

  return res.send(JSON.stringify(data[userId]));
});

app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`));
