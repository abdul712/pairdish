import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PopularDishes } from "@/components/dishes/PopularDishes"
import { FeaturedRecipes } from "@/components/dishes/FeaturedRecipes"

export function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Find the Perfect Side Dish for Any Meal
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              Discover delicious pairings, side dishes, and recipes that complement your favorite meals perfectly.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex gap-2">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a dish..."
                  className="flex-1 h-12 px-6 text-lg rounded-full border-2 border-orange-200 focus:border-orange-500"
                />
                <Button 
                  type="submit"
                  size="lg"
                  className="rounded-full bg-orange-500 hover:bg-orange-600 h-12 px-6"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
            Popular Dishes
          </h2>
          <p className="text-gray-600 mb-8">Explore our most searched meal pairings</p>
          <PopularDishes />
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
            Featured Recipes
          </h2>
          <p className="text-gray-600 mb-8">Try our hand-picked recipe recommendations</p>
          <FeaturedRecipes />
        </div>
      </section>
    </>
  )
}