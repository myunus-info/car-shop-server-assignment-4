import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'https://car-shop-client.vercel.app', credentials: true }));

// logging
app.use(morgan('dev'));

// application routes
app.use('/api', router);

const getAController = async (req: Request, res: Response) => {
  res.send('Welcome to my car shop');
};
app.get('/', getAController);

// global error handler
app.use(globalErrorHandler);
// not found handler
app.use(notFound);

export default app;
