import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Search } from "lucide-react"
import { api, type Dish } from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<Dish[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query && query.length >= 2) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.searchDishes(searchTerm)
      if (response.success) {
        setResults(response.results)
      } else {
        setError("Search failed")
      }
    } catch (err) {
      setError("Failed to search dishes")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && searchQuery.length >= 2) {
      setSearchParams({ q: searchQuery })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Dishes</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 max-w-2xl">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for dishes... (minimum 2 characters)"
            className="flex-1"
          />
          <Button type="submit" disabled={searchQuery.length < 2}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <DishSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-8 text-gray-500">
          No results found for "{query}"
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-gray-600 mb-4">
            Found {results.length} results for "{query}"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((dish) => (
              <Link
                key={dish.id}
                to={`/dish/${dish.id}`}
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
        </>
      )}
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