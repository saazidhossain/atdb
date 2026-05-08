import { createFileRoute } from "@tanstack/react-router";
import Equipment from "@/pages/Equipment";

export const Route = createFileRoute("/equipment/$category/")({
  component: Equipment,
});
