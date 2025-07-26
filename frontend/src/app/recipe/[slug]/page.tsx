import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pairDishAPI from '@/lib/api';
import { generateMetadata as generateSEOMetadata, generateRecipeMetadata } from '@/lib/seo';
import RecipeHeader from '@/components/RecipeHeader';
import RecipeIngredients from '@/components/RecipeIngredients';
import RecipeInstructions from '@/components/RecipeInstructions';
import RecipeInfo from '@/components/RecipeInfo';
import RelatedRecipes from '@/components/RelatedRecipes';

interface RecipePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  try {
    const recipe = await pairDishAPI.getRecipe(params.slug);
    const seoMetadata = generateRecipeMetadata(recipe.title, recipe.description);
    
    return generateSEOMetadata({
      ...seoMetadata,
      openGraph: {
        ...seoMetadata.openGraph,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/recipe/${params.slug}`,
        image: recipe.imageUrl,
      },
    });
  } catch (error) {
    return generateSEOMetadata({
      title: 'Recipe Not Found | PairDish',
      description: 'The recipe you are looking for could not be found.',
    });
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  let recipe;

  try {
    recipe = await pairDishAPI.getRecipe(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Recipe Header */}
      <RecipeHeader recipe={recipe} />

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recipe Content - Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {recipe.description && (
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700">{recipe.description}</p>
              </div>
            )}

            {/* Ingredients */}
            <RecipeIngredients ingredients={recipe.ingredients} servings={recipe.servings} />

            {/* Instructions */}
            <RecipeInstructions instructions={recipe.instructions} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Recipe Info Card */}
            <RecipeInfo recipe={recipe} />

            {/* Related Recipes */}
            <RelatedRecipes currentRecipe={recipe} />
          </aside>
        </div>
      </div>
    </div>
  );
}