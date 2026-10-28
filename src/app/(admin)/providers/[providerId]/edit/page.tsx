import ProviderEditPage from "@/providers/detail/edit";

type PageProps = {
  params: Promise<{ providerId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { providerId } = await params;
  return <ProviderEditPage providerId={providerId} />;
}
