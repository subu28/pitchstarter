import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';
import express, { type Request, type Response } from 'express';

import meetingPrepV1 from './routes/v1.meetingPrep';
import { registerWorker } from './connectors/mockQ';
import { participantResearchWorker } from './workers/participantResearchWorker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new express application instance
const app = express();
app.use(bodyParser.json());

registerWorker('participant_research', participantResearchWorker);

console.log('Start server');

// Middleware to handle CORS and preflight requests
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000',
  );
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.send(200);
  } else {
    //move on
    next();
  }
});

// Health check endpoint
app.get('/v1/health', (_req: Request, res: Response) => {
  res.json({ message: 'OK' });
});

// serve the API routes
app.use('/v1/meeting_prep', meetingPrepV1);

app.use(
  express.static(path.join(__dirname, '../frontend/dist')),
);
// serve the frontend files
app.get('/{*any}', async (_req: Request, res: Response) => {
  const file = await readFile(
    `${path.join(__dirname, '../frontend/dist')}/index.html`,
    'utf8',
  );
  res.send(file);
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The server is up. running on port ${port}`);
});
