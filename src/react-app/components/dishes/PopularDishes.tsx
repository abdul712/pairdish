import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api, type Dish } from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PopularDishes() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await api.getDishes(8)
        if (response.success && response.dishes) {
          setDishes(response.dishes)
        } else {
          setError(response.error || "Failed to load dishes")
        }
      } catch (err) {
        setError("Failed to load popular dishes")
      } finally {
        setLoading(false)
      }
    }

    fetchDishes()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <DishSkeleton key={i} />
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

  if (dishes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No dishes found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {dishes.map((dish) => (
        <Link
          key={dish.id}
          to={`/what-to-serve-with-${dish.slug}`}
          className="group"
        >
          <Card className="h-full hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={dish.image_url || dish.imageUrl || "/placeholder.jpg"}
                alt={dish.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                {dish.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {dish.description || ""}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{dish.cuisine || "International"}</span>
                <span className="capitalize">
                  {dish.dish_type || dish.category || "main"}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function DishSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="w-full h-48 rounded-t-lg" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}