import OrchestrationDetail from "@/orchestration/detail";

type OrchestrationDetailPageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function OrchestrationDetailPage({
  params,
}: OrchestrationDetailPageProps) {
  const { deliveryId } = await params;
  return <OrchestrationDetail deliveryId={deliveryId} />;
}
