import { createFileRoute } from "@tanstack/react-router";
import { LiltApp } from "@/components/lilt/lilt-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <LiltApp />;
}
