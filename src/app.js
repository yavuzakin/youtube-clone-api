import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Routers
import userRouter from './routes/userRoutes.js';
import videoRouter from './routes/videoRoutes.js';
import commentRouter from './routes/commentRoutes.js';
// Utils
import AppError from './utils/AppError.js';
import globalErrorHandler from './utils/globalErrorHandler.js';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'youtube-clone-ui.herokuapp.com'],
    credentials: true,
  })
);

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/comments', commentRouter);

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
