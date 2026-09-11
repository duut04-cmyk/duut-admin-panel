import AdminContainer from "./AdminContainer";
import AdminShell from "./AdminShell";
import AdminEmptyState from "@/ui/AdminEmptyState";

type ComingSoonPageProps = {
  title: string;
  subtitle?: string;
};

export default function ComingSoonPage({
  title,
  subtitle = "This section is coming soon.",
}: ComingSoonPageProps) {
  return (
    <AdminShell title={title} subtitle={subtitle}>
      <AdminContainer className="pb-10">
        <AdminEmptyState
          title="Coming soon"
          description="We're building this section. Check back later."
        />
      </AdminContainer>
    </AdminShell>
  );
}
