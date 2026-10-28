import CustomerEditPage from "@/customers/detail/edit";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { customerId } = await params;
  return <CustomerEditPage customerId={customerId} />;
}
