import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Header } from "@/shared/components/header.tsx";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.token) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: () => {
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  },
});
