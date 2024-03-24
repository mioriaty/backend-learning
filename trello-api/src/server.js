/* eslint-disable no-console */
import 'dotenv/config';
import express from 'express';
import { APP_HOST, APP_PORT } from '~/configs/constants';
import { CONNECT_DB, GET_DB } from '~/configs/mongodb';

const START_SERVER = () => {
  const app = express();
  const hostname = APP_HOST;
  const port = APP_PORT;

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray());
    res.send('<h1>Hello World!</h1>');
  });


  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });

}
CONNECT_DB()
  .then(() => {
    console.log('Connected to MongoDB');
  }).then(() => {
    START_SERVER();
  }).catch((err) => {
    console.error(err);
    process.exit(0);
  })