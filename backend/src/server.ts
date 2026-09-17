import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

 dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'diagram-interview-prep-api' });
});

app.get('/api/diagrams', (_req, res) => {
  res.json({ data: [] });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
