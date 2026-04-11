# PairDish - Food Pairing Platform

A modern web application for discovering perfect food pairings and side dish suggestions. Find the ideal side dishes for over 5,000 main dishes with expert-curated pairing recommendations.

## 🚀 Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Helmet Async** for SEO meta tags

### Backend  
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **PostgreSQL** database
- **Helmet** for security headers
- **Morgan** for logging
- **CORS** middleware

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **Nginx** for production reverse proxy
- **PostgreSQL 15** database
- Ready for **Coolify** deployment

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components (Home, Search, Dish Detail)
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Express.js backend API
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API route definitions
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions (sitemap, etc.)
│   └── package.json       # Backend dependencies
├── shared/                # Shared TypeScript types
├── database/              # Database schema and migrations
├── nginx/                 # Nginx configuration
├── docker-compose.yml     # Docker services configuration
├── Dockerfile             # Multi-stage build configuration
└── .env.example           # Environment variables template
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pair-dish
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp client/.env.example client/.env
   # Edit .env files with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies  
   cd ../client && npm install
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb pairdish
   
   # Import schema
   psql -d pairdish -f database/schema.sql
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Start backend (from server directory)
   cd server && npm run dev
   
   # Terminal 2 - Start frontend (from client directory)
   cd client && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Docker Development

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🚀 Production Deployment

### Docker Production Build

```bash
# Build and start production services
docker-compose -f docker-compose.yml up -d

# With Nginx (recommended)
docker-compose --profile production up -d
```

### Environment Variables

**Server (.env)**
```bash
DB_HOST=postgres
DB_PORT=5432
DB_NAME=pairdish
DB_USER=pairdish_user
DB_PASSWORD=secure_password_here
JWT_SECRET=your_super_secure_jwt_secret
CLIENT_URL=https://yourdomain.com
NODE_ENV=production
```

**Client (.env)**
```bash
VITE_API_URL=https://api.yourdomain.com
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **main_dishes** - Primary dish information with SEO-friendly slugs
- **side_dishes** - Side dish information and descriptions  
- **dish_pairings** - Many-to-many relationships with match scores
- **popular_dishes** - View tracking for popularity metrics

See `database/schema.sql` for complete schema definition.

## 🔍 SEO Features

- Dynamic meta tags with React Helmet
- Structured data (JSON-LD) for rich snippets
- Sitemap.xml generation for all dish pages
- Canonical URLs and Open Graph tags
- SEO-optimized URL structure: `/what-to-serve-with-{dish-slug}`

## 🎯 Key Features

- **Search & Discovery** - Find dishes and pairings with intelligent search
- **Expert Curation** - Match scores and detailed pairing explanations
- **Responsive Design** - Works perfectly on desktop and mobile
- **Performance Optimized** - Fast loading with Vite and modern React
- **SEO Ready** - Structured for organic search visibility

## 🧪 Available Scripts

### Frontend (client/)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend (server/)
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
```

## 📝 API Endpoints

- `GET /api/dishes` - List main dishes with pagination
- `GET /api/dishes/:slug` - Get specific dish details
- `GET /api/dishes/:slug/pairings` - Get pairing suggestions
- `GET /api/dishes/popular` - Get popular dishes
- `GET /api/search` - Search dishes with query
- `GET /sitemap.xml` - Dynamic sitemap generation
- `GET /robots.txt` - SEO robots directives

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Documentation

- [Product Requirements Document](./PRD.md)
- [Claude Development Guide](./CLAUDE.md)
- [Database Schema](./database/schema.sql)