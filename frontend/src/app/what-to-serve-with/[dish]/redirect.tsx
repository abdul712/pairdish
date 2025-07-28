'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectPageProps {
  params: {
    dish: string;
  };
}

export default function RedirectPage({ params }: RedirectPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new URL structure
    router.replace(`/dishes/${params.dish}/pairings`);
  }, [params.dish, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}