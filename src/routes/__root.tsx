import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LangProvider } from "@/hooks/useLang";
import { CartProvider } from "@/hooks/useCart";
import CartDrawer from "@/components/CartDrawer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import PageTransition from "@/components/PageTransition";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-400"
          >
            Go home
          </Link>
        </div>
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
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-400"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
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
      { title: "ATDB Trade International — Heavy Equipment Rental, Bangladesh" },
      {
        name: "description",
        content:
          "Bangladesh's premier heavy equipment rental partner since 2000. Cranes, rollers, excavators, loaders & support equipment. CIS-certified, 1st Class contractor.",
      },
      { name: "author", content: "ATDB Trade International" },
      { name: "theme-color", content: "#0f1318" },
      { property: "og:title", content: "ATDB Trade International — Heavy Equipment Rental" },
      {
        property: "og:description",
        content: "Heavy equipment rental and infrastructure support in Bangladesh. Since 2000.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/assets/atdb-hero-monument-C3bd27q6.webp" },
      { property: "og:locale", content: "en_BD" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/assets/atdb-hero-monument-C3bd27q6.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Hind+Siliguri:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "M/S ATDB Trade International",
          url: "/",
          logo: "/assets/atdb-logo-dark.webp",
          foundingDate: "2000",
          description: "Heavy equipment rental and 1st Class contractor in Bangladesh.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "House #319 (8F), Lane #8, East Kazi Para, Kafrul",
            addressLocality: "Dhaka",
            postalCode: "1216",
            addressCountry: "BD",
          },
          contactPoint: [{
            "@type": "ContactPoint",
            telephone: "+8801712106242",
            contactType: "sales",
            availableLanguage: ["en", "bn"],
          }],
          sameAs: ["https://www.facebook.com/atdbtrade"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <CartProvider>
          <ErrorBoundary routeName="root">
            <PageTransition>
              <Outlet />
            </PageTransition>
            <CartDrawer />
            <Toaster />
          </ErrorBoundary>
        </CartProvider>
      </LangProvider>
    </QueryClientProvider>
  );
}
