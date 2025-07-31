import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Clock, ChefHat } from "lucide-react"
import { api, type Recipe } from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function FeaturedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await api.getFeaturedRecipes()
        setRecipes(data)
      } catch (err) {
        setError("Failed to load featured recipes")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <RecipeSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recipes found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Link
          key={recipe.id}
          to={`/recipe/${recipe.slug}`}
          className="group"
        >
          <Card className="h-full hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={recipe.image_url || "/placeholder.jpg"}
                alt={recipe.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge 
                className="absolute top-4 right-4 bg-white/90 text-gray-800"
                variant="secondary"
              >
                {recipe.difficulty}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                {recipe.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {recipe.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.prep_time + recipe.cook_time} mins</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function RecipeSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="w-full h-48 rounded-t-lg" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}