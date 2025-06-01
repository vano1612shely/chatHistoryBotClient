import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import { QueryClient } from "@tanstack/query-core";
import { AuthProvider } from "@/providers/authProvider.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store.ts";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export interface RouterContext {
  queryClient: QueryClient;
  token: string;
}

const router = createRouter({
  routeTree,
  context: undefined!,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
    context: RouterContext;
  }
}

const App = () => {
  const token = useAuthStore((state) => state.token);

  return <RouterProvider router={router} context={{ queryClient, token }} />;
};

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <HeroUIProvider>
            <ToastProvider
              toastProps={{ timeout: 3000 }}
              placement={"bottom-right"}
            />
            <App />
          </HeroUIProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
