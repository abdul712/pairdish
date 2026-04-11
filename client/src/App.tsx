import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { DishDetailPage } from './pages/DishDetailPage';
import { SearchPage } from './pages/SearchPage';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="what-to-serve-with/:slug" element={<DishDetailPage />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={
              <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground mb-6">
                  The page you're looking for doesn't exist.
                </p>
                <a href="/" className="text-primary hover:underline">
                  Go back home
                </a>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
