import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
});

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
      <body className={plusJakartaSans.className}>
        <Navigation />
        <ErrorBoundary>
          <main className="min-h-screen">
            {children}
          </main>
        </ErrorBoundary>
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