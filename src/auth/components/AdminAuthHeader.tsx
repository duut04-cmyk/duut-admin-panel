import Logo from "@/common/components/Logo";

export default function AdminAuthHeader() {
  return (
    <header className="mb-8 space-y-1 text-center">
      <Logo className="text-heading" />
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        Operations
      </p>
      <p className="text-small text-muted-foreground">Admin workspace</p>
    </header>
  );
}
