import { Link } from "react-router-dom"
import { Utensils } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-orange-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-orange-500 rounded-full group-hover:bg-orange-600 transition-colors">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-orange-800">PairDish</span>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Browse
            </Link>
            <Link 
              to="/recipe/featured" 
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Recipes
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}