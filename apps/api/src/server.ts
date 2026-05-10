import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
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

// Serve static assets in production (Frontend SPA)
if (env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production') {
  const webDistPath = path.resolve(__dirname, '../../web/dist');
  if (fs.existsSync(webDistPath)) {
    console.log(`[server]: Serving static files from ${webDistPath}`);
    app.use(express.static(webDistPath));
    
    // Wildcard route to serve the React application index.html for SPA routing
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.join(webDistPath, 'index.html'));
    });
  } else {
    console.warn(`[server]: Frontend build folder not found at ${webDistPath}. Static file serving disabled.`);
  }
}

// Error Handler
app.use(errorHandler);
