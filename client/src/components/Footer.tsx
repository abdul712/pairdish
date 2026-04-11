import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="text-xl font-bold text-primary">
              PairDish
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              Perfect food pairings and side dish suggestions for any meal.
            </p>
          </div>

          {/* Popular Dishes */}
          <div>
            <h3 className="font-semibold mb-3">Popular Dishes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/what-to-serve-with/chicken-biryani" className="hover:text-foreground">Chicken Biryani</Link></li>
              <li><Link to="/what-to-serve-with/pasta" className="hover:text-foreground">Pasta</Link></li>
              <li><Link to="/what-to-serve-with/steak" className="hover:text-foreground">Steak</Link></li>
              <li><Link to="/what-to-serve-with/pizza" className="hover:text-foreground">Pizza</Link></li>
            </ul>
          </div>

          {/* Cuisines */}
          <div>
            <h3 className="font-semibold mb-3">Cuisines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/cuisine/indian" className="hover:text-foreground">Indian</Link></li>
              <li><Link to="/cuisine/italian" className="hover:text-foreground">Italian</Link></li>
              <li><Link to="/cuisine/american" className="hover:text-foreground">American</Link></li>
              <li><Link to="/cuisine/mexican" className="hover:text-foreground">Mexican</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 PairDish. All rights reserved.</p>
          <p>Find the perfect side dish for any meal.</p>
        </div>
      </div>
    </footer>
  );
}