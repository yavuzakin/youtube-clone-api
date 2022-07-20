import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Routers
import userRouter from './routes/userRoutes.js';
import videoRouter from './routes/videoRoutes.js';
// Utils
import AppError from './utils/AppError.js';
import globalErrorHandler from './utils/globalErrorHandler.js';

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.method} ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);

export default app;
