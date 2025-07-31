import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { api, type Dish, type Pairing } from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function DishDetailPage() {
  const { id, slug } = useParams()
  const [dish, setDish] = useState<Dish | null>(null)
  const [pairings, setPairings] = useState<Pairing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        let dishId = id
        
        // If we have a slug but no id, we need to fetch all dishes and find the one with matching slug
        if (slug && !id) {
          const response = await api.getDishes(100) // Get more dishes to find the right one
          if (response.success && response.dishes) {
            const foundDish = response.dishes.find(d => d.slug === slug)
            if (foundDish) {
              dishId = foundDish.id.toString()
            }
          }
        }

        if (!dishId) {
          setError("Dish not found")
          return
        }

        // Fetch dish details and pairings
        const [dishResponse, pairingsResponse] = await Promise.all([
          api.getDishById(dishId),
          api.getDishPairings(dishId)
        ])

        if (dishResponse.success && dishResponse.dish) {
          setDish(dishResponse.dish)
        }

        if (pairingsResponse.success) {
          setPairings(pairingsResponse.pairings)
        }
      } catch (err) {
        setError("Failed to load dish details")
      } finally {
        setLoading(false)
      }
    }

    fetchDishData()
  }, [id, slug])

  if (loading) {
    return <DishDetailSkeleton />
  }

  if (error || !dish) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Dish not found"}
          </h2>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <img
              src={dish.image_url || dish.imageUrl || "/placeholder.jpg"}
              alt={dish.name}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-4">{dish.name}</h1>
              <p className="text-gray-600 mb-4">
                {dish.description || "A delicious dish perfect for any occasion."}
              </p>
              
              <div className="space-y-2">
                {dish.cuisine && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Cuisine:</span>
                    <Badge variant="secondary">{dish.cuisine}</Badge>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Type:</span>
                  <Badge variant="secondary" className="capitalize">
                    {dish.dish_type || dish.category || "main"}
                  </Badge>
                </div>
                {dish.dietaryTags && dish.dietaryTags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">Dietary:</span>
                    {dish.dietaryTags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">
            What to Serve with {dish.name}
          </h2>
          
          {pairings.length === 0 ? (
            <p className="text-gray-500">No pairings found for this dish.</p>
          ) : (
            <div className="space-y-4">
              {pairings.map((pairing) => (
                <Card key={pairing.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {pairing.name}
                        </h3>
                        {pairing.pairingReason && (
                          <p className="text-gray-600 text-sm mb-2">
                            {pairing.pairingReason}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {pairing.cuisine && (
                            <span>{pairing.cuisine}</span>
                          )}
                          <span className="capitalize">
                            {pairing.dish_type || pairing.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">
                          {pairing.matchScore}%
                        </div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DishDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="w-32 h-8 mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <Skeleton className="w-full h-64 rounded-t-lg" />
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}