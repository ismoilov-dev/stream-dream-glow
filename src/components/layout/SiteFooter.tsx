import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background mt-20">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-brand grid place-items-center">
              <span className="text-primary-foreground font-black text-sm">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              Stream<span className="text-primary">Play</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A premium streaming experience for movies and series. Cinematic quality, anywhere.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Browse</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/movies" className="hover:text-foreground">Movies</Link></li>
            <li><Link to="/series" className="hover:text-foreground">Series</Link></li>
            <li><Link to="/genres" className="hover:text-foreground">Genres</Link></li>
            <li><Link to="/search" className="hover:text-foreground">Search</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/profile" className="hover:text-foreground">Profile</Link></li>
            <li><Link to="/watchlist" className="hover:text-foreground">My List</Link></li>
            <li><Link to="/history" className="hover:text-foreground">Watch history</Link></li>
            <li><Link to="/subscriptions" className="hover:text-foreground">Subscription</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Press</a></li>
            <li><a href="#" className="hover:text-foreground">Help center</a></li>
            <li><a href="#" className="hover:text-foreground">Terms of use</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-8 py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} StreamPlay. All rights reserved.</span>
          <span>Crafted with cinematic care.</span>
        </div>
      </div>
    </footer>
  );
}
