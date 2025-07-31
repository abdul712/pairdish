# PairDish React Migration

A modern React application built with Vite, shadcn/ui, and deployed on Cloudflare Workers.

## 🚀 Tech Stack

- **React 19** - Modern UI library with latest features
- **Vite** - Lightning-fast build tooling and development server
- **TypeScript** - Type-safe development
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS v4** - Utility-first CSS framework
- **Hono** - Ultralight, modern backend framework
- **Cloudflare Workers** - Edge computing platform for global deployment

## ✨ Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🌙 Dark/Light mode support with system preference detection
- 🎨 Beautiful UI components with shadcn/ui
- 📱 Responsive design
- 🔄 Full-stack development setup

## 🏗️ Project Structure

```
pairdish-react-migration/
├── public/                 # Static assets
├── src/
│   ├── react-app/         # React application
│   │   ├── components/    # React components
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── lib/          # Utility functions
│   │   ├── App.tsx       # Main React component
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # Global styles with Tailwind
│   └── worker/           # Cloudflare Worker
│       └── index.ts      # Worker entry point with Hono
├── components.json       # shadcn/ui configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── wrangler.toml         # Cloudflare Workers configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account (for deployment)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   Your application will be available at [http://localhost:5173](http://localhost:5173/).

### Development

- **Development server:** `npm run dev`
- **Type checking:** `npm run check`
- **Linting:** `npm run lint`
- **Generate Cloudflare types:** `npm run cf-typegen`

### Production

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Deploy to Cloudflare Workers:**
   ```bash
   npm run deploy
   ```

## 🎨 Adding Components

This project uses shadcn/ui for components. To add new components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## 🔧 Configuration

### Environment Variables

Create a `.dev.vars` file for local development:

```bash
# Example environment variables
API_URL=https://api.example.com
DATABASE_URL=your_database_url
```

### Cloudflare Bindings

Add your Cloudflare bindings in `wrangler.toml`:

```toml
# Example bindings
[[kv_namespaces]]
binding = "MY_KV"
id = "your_kv_namespace_id"

[[d1_databases]]
binding = "DB"
database_name = "your_database_name"
database_id = "your_database_id"
```

## 📁 API Routes

The Hono backend provides several API endpoints:

- `GET /api/hello` - Health check endpoint
- `GET /api/health` - Service health status
- `GET /api/dishes` - Example dishes data

## 🌙 Dark Mode

The application includes a built-in theme system with:

- Light mode
- Dark mode  
- System preference detection
- Persistent theme selection

## 🚀 Deployment

### Cloudflare Workers

1. **Configure wrangler.toml** with your project settings
2. **Run deployment:**
   ```bash
   npm run deploy
   ```

### Custom Domain

Add a custom domain in your Cloudflare dashboard under Workers & Pages.

## 🛠️ Development Tools

- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting (add .prettierrc if needed)
- **Vite** - Fast development and building

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Hono Documentation](https://hono.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.