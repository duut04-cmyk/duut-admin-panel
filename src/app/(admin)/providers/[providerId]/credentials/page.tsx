import ProviderCredentialsPage from "@/providers/detail/credentials";

type PageProps = {
  params: Promise<{ providerId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { providerId } = await params;
  return <ProviderCredentialsPage providerId={providerId} />;
}
