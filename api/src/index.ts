import * as path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import uuidv4 from 'uuid/v4';

interface User {
  fullName: string;
}

const PORT = process.env.PORT || 8080;

let data: { [userId: string]: User } = {};

const app = express();
app.use(bodyParser.json());

app.get('/:userId', (req, res) => {
  const api = req.accepts().includes('application/json');

  const { userId } = req.params;
  const user = data[userId];

  if (!user) {
    return res.sendStatus(404);
  }

  if (api) {
    res.send(JSON.stringify(data[userId]));
  } else {
    ejs.renderFile(
      path.join(__dirname, 'profile.ejs'),
      {
        user,
      },
      (err, str) => {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }

        res.send(str);
      }
    );
  }
});

function validateUser(user: any): User | null {
  if (typeof user === 'object' && typeof user.fullName === 'string') {
    return <User>user;
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
