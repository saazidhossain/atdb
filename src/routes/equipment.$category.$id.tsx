import { createFileRoute } from "@tanstack/react-router";
import EquipmentDetail from "@/pages/EquipmentDetail";

export const Route = createFileRoute("/equipment/$category/$id")({
  component: EquipmentDetail,
});
