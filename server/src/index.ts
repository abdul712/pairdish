import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFound } from './middleware/errorHandler';
import { SitemapGenerator } from './utils/sitemap';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS middleware
app.use(corsMiddleware);

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// SEO routes
const sitemapGenerator = new SitemapGenerator(process.env.CLIENT_URL || 'https://pairdish.com');

app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await sitemapGenerator.generateSitemap();
    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/robots.txt', async (req, res) => {
  try {
    const robotsTxt = await sitemapGenerator.generateRobotsTxt();
    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).send('Error generating robots.txt');
  }
});

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to PairDish API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PairDish API server running on port ${PORT}`);
  console.log(`📚 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});