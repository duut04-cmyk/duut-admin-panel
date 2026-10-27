import AdminAppLayout from "@/components/admin-layout/AdminAppLayout";

export default function AuthenticatedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminAppLayout>{children}</AdminAppLayout>;
}
