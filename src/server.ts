/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Synchronous error
process.on('uncaughtException', (err) => {
  console.log(`🔥🔥🔥 UncaughtException detected. Shutting down...`);
  console.log(`${err.name}: ${err.message}`);
  process.exit(1);
});

// Imports
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
bootstrap();

// Asynchronous error
process.on('unhandledRejection', (err) => {
  console.log(`🔥🔥🔥 UnhandledRejection detected. Shutting down... `);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
