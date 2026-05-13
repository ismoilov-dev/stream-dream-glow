import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useAuthStore } from "@/lib/auth-store";
import { Users } from "@/lib/api";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the cinematic void</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page slipped off the reel. Head back to the home screen.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-elevated"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StreamPlay — Premium movies & series" },
      {
        name: "description",
        content:
          "Stream blockbuster movies and award-winning series in cinematic quality. Personalized picks, continue watching, and more.",
      },
      { name: "theme-color", content: "#0a0a0f" },
      { property: "og:title", content: "StreamPlay — Premium movies & series" },
      { property: "og:description", content: "Cinematic Stream is a modern, responsive streaming platform frontend for discovering and watching movies and series." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "StreamPlay — Premium movies & series" },
      { name: "description", content: "Cinematic Stream is a modern, responsive streaming platform frontend for discovering and watching movies and series." },
      { name: "twitter:description", content: "Cinematic Stream is a modern, responsive streaming platform frontend for discovering and watching movies and series." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cdd79f81-9c54-4652-9947-07f36be8b4f8/id-preview-098e42e0--f8611a0b-9637-466a-953f-6c3ebd84f9d0.lovable.app-1778671699678.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cdd79f81-9c54-4652-9947-07f36be8b4f8/id-preview-098e42e0--f8611a0b-9637-466a-953f-6c3ebd84f9d0.lovable.app-1778671699678.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function HydrateUser() {
  const { tokens, user, setUser, logout } = useAuthStore();
  useEffect(() => {
    if (tokens?.access && !user) {
      Users.me()
        .then(setUser)
        .catch(() => logout());
    }
  }, [tokens?.access, user, setUser, logout]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isPlayer = location.pathname.startsWith("/watch");
  const isAuthScreen =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/forgot-password");

  return (
    <QueryClientProvider client={queryClient}>
      <HydrateUser />
      {!isPlayer && !isAuthScreen && <SiteHeader />}
      <main className={isPlayer ? "min-h-screen bg-black" : "min-h-screen"}>
        <Outlet />
      </main>
      {!isPlayer && !isAuthScreen && <SiteFooter />}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "glass !border-border !text-foreground",
          },
        }}
      />
    </QueryClientProvider>
  );
}
