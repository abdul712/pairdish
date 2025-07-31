import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/Header"
import { HomePage } from "@/pages/HomePage"
import { SearchPage } from "@/pages/SearchPage"
import { DishDetailPage } from "@/pages/DishDetailPage"
import { RecipePage } from "@/pages/RecipePage"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pairdish-ui-theme">
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/dish/:id" element={<DishDetailPage />} />
            <Route path="/what-to-serve-with-:slug" element={<DishDetailPage />} />
            <Route path="/recipe/:slug" element={<RecipePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App