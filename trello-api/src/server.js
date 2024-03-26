/* eslint-disable no-console */
import exitHook from 'async-exit-hook';
import 'dotenv/config';
import express from 'express';
import { env } from '~/configs/environment';
import { mongoDBConnection } from '~/configs/mongodb';
import { APIs_V1 } from './routes/v1';

const START_SERVER = () => {
  const app = express();

  app.use(APIs_V1);

  app.get('/', async (req, res) => {
    res.send('<h1>Hello World!</h1>');
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server running at http://${env.APP_HOST}:${env.APP_PORT}/`);
  });

  // Clean up trước khi shutdown server
  exitHook(async () => {
    console.log('Server is shutting down');
    await mongoDBConnection.disconnect();
    console.log('Disconnected from MongoDB');
  });
};

// Chỉ khi kết nối tới database thành công thì mới khởi tạo server
(async function () {
  try {
    await mongoDBConnection.connect();
    console.log('Connected to MongoDB');
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();