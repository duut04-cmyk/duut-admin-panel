import type { Metadata } from "next";
import SupportPage from "@/support";

export const metadata: Metadata = {
  title: "Help & Support | Doot Admin",
  description:
    "Find answers about deliveries, providers, integrations, and contacting Doot support.",
};

export default function Page() {
  return <SupportPage />;
}
