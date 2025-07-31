import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecipePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Recipe Page</h1>
        <p className="text-gray-600 mb-8">
          Recipe details coming soon! This feature is currently under development.
        </p>
        <Link to="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}