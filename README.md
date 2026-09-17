# Diagram Interview Prep

A minimal runnable starter for drawing system-design diagrams.

## Run locally

Start the API:

```bash
cd backend
npm install
npm run dev
```

In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The API health check is available at http://localhost:5000/health.

For a production-style backend container:

```bash
docker build -t diagram-interview-prep-api ./backend
docker run --rm -p 5000:5000 diagram-interview-prep-api
```

The current starter intentionally keeps persistence and authentication out of the first runnable slice. Those can be added behind the API once the canvas flow is established.
