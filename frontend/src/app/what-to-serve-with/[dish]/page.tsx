import { redirect } from 'next/navigation';

interface DishPageProps {
  params: {
    dish: string;
  };
}

export default function DishPage({ params }: DishPageProps) {
  // Redirect to the new URL structure
  redirect(`/dishes/${params.dish}/pairings`);
}