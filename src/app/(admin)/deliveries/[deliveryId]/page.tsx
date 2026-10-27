import DeliveryDetail from "@/deliveries/detail";

type DeliveryDetailPageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function DeliveryDetailPage({ params }: DeliveryDetailPageProps) {
  const { deliveryId } = await params;
  return <DeliveryDetail deliveryId={deliveryId} />;
}
