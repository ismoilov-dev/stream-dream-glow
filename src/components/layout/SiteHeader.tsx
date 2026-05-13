import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User as UserIcon, LogOut, Heart, History, Crown, Shield, Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { SearchModal } from "@/components/media/SearchModal";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/series", label: "Series" },
  { to: "/genres", label: "Genres" },
  { to: "/subscriptions", label: "Plans" },
] as const;

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled ? "glass-strong" : "bg-gradient-to-b from-background/90 to-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-4 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 rounded-lg gradient-brand shadow-glow grid place-items-center">
                <span className="text-primary-foreground font-black text-sm tracking-tighter">S</span>
              </div>
              <span className="hidden sm:inline text-lg font-bold tracking-tight">
                Stream<span className="text-primary">Play</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                  activeProps={{ className: "px-3 py-2 rounded-md text-foreground font-medium" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface/60 hover:bg-surface text-muted-foreground hover:text-foreground border border-border transition-all w-56 lg:w-72"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm flex-1 text-left">Search…</span>
              <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-background/50 border border-border">⌘K</kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-md hover:bg-surface"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {isAuthenticated ? (
              <>
                <button className="hidden sm:inline-flex p-2 rounded-md hover:bg-surface" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full pl-2 pr-1 py-1 hover:bg-surface transition-colors">
                      <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
                        {user?.first_name || user?.username || "Profile"}
                      </span>
                      <div className="h-8 w-8 rounded-full gradient-brand grid place-items-center text-primary-foreground text-xs font-bold ring-2 ring-background">
                        {user?.username?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                      <UserIcon className="h-4 w-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: "/watchlist" })}>
                      <Heart className="h-4 w-4 mr-2" /> My List
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: "/history" })}>
                      <History className="h-4 w-4 mr-2" /> History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: "/subscriptions" })}>
                      <Crown className="h-4 w-4 mr-2" /> Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                      <Shield className="h-4 w-4 mr-2" /> Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        navigate({ to: "/" });
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-surface"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-md text-sm font-medium gradient-brand text-primary-foreground hover:brightness-110 transition"
                >
                  Get started
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-md hover:bg-surface"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden glass-strong border-t border-border"
            >
              <nav className="flex flex-col px-4 py-3 gap-1">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface"
                  >
                    {n.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="flex gap-2 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 px-3 py-2 rounded-md text-center bg-surface"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 px-3 py-2 rounded-md text-center gradient-brand text-primary-foreground"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
