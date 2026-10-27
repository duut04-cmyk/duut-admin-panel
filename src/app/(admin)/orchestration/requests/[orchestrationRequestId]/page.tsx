import OrchestrationRunDetail from "@/orchestration/runDetail";

type OrchestrationRunDetailPageProps = {
  params: Promise<{ orchestrationRequestId: string }>;
};

export default async function OrchestrationRunDetailPage({
  params,
}: OrchestrationRunDetailPageProps) {
  const { orchestrationRequestId } = await params;
  return <OrchestrationRunDetail orchestrationRequestId={orchestrationRequestId} />;
}
