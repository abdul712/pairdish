import { Link, useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            PairDish
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                variant="ghost"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link 
              to="/cuisines" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cuisines
            </Link>
            <Link 
              to="/popular" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Popular
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}