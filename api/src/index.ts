import express from 'express';

const PORT = process.env.PORT || 8080;

const app = express();

interface User {
  userId: string;
  fullName: string;
}

const data: { [userId: string]: User } = {};

app.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const api = req.accepts().includes('application/json');

  if (api) {
    if (data[userId]) {
      res.send(JSON.stringify(data[userId]));
    } else {
      res.sendStatus(404);
    }
  } else {
    // return user page
  }
});

app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`));
