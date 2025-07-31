'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            PairDish
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Search
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Categories
            </Link>
            <Link href="/recipes" className="text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
              All Recipes
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <Link
              href="/search"
              onClick={closeMobileMenu}
              className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Search
            </Link>
            <Link
              href="/categories"
              onClick={closeMobileMenu}
              className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/recipes"
              onClick={closeMobileMenu}
              className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              All Recipes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}