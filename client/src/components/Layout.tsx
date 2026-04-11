import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';

export function Layout() {
  return (
    <>
      {/* Default SEO tags - pages can override these */}
      <SEOHead />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}