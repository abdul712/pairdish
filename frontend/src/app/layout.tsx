import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = generateSEOMetadata({
  title: 'PairDish - Perfect Side Dishes for Every Meal',
  description: 'Discover the perfect side dishes, sauces, and pairings for any meal. Find recipes and pairing suggestions for your favorite dishes.',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b">
          <div className="container">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="text-2xl font-bold text-primary-600">
                PairDish
              </a>
              <div className="flex items-center space-x-6">
                <a href="/search" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Search
                </a>
                <a href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Categories
                </a>
                <a href="/recipes" className="text-gray-700 hover:text-primary-600 transition-colors">
                  All Recipes
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-100 mt-16">
          <div className="container py-8">
            <div className="text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} PairDish. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}