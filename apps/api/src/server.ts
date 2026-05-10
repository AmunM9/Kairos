import express from 'express';
import cors from 'cors';
import { env } from './config/env';

// Routers
import healthRouter from './routes/health';
import searchRouter from './routes/search';
import usageRouter from './routes/usage';
import analysisRouter from './routes/analysis';

// Middlewares
import { errorHandler } from './middleware/errorHandler';

export const app = express();

const corsOrigin = env.NODE_ENV === 'development'
  ? (_origin: string | undefined, cb: (e: Error | null, ok?: boolean) => void) => cb(null, true)
  : env.ALLOWED_ORIGIN;
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/search', searchRouter);
app.use('/api/usage', usageRouter);
app.use('/api/analysis', analysisRouter);

// Error Handler
app.use(errorHandler);
