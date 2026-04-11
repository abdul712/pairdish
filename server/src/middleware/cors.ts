import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server default port
  'http://localhost:5174', // Vite dev server alternative port
  'http://localhost:5175', // Vite dev server another port
  'http://localhost:3000', // Alternative dev port
  process.env.CLIENT_URL,   // Production client URL
].filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});