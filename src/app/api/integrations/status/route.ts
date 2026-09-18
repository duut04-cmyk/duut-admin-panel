import { NextResponse } from "next/server";
import { backendFetch, getBackendApiUrl, parseBackendJson } from "@/lib/backendClient";
import type { IntegrationsStatus } from "@/data/integrationTypes";

type BackendStatusResponse = {
  success: boolean;
  data?: IntegrationsStatus;
  error?: { message?: string };
};

function enrichWebhookUrls(data: IntegrationsStatus): IntegrationsStatus {
  const baseUrl = getBackendApiUrl()?.replace(/\/$/, "") ?? "";

  return {
    ...data,
    categories: data.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => {
        const webhookPath = item.metadata.webhookPath;
        if (!webhookPath) {
          return item;
        }

        return {
          ...item,
          webhookUrl: baseUrl ? `${baseUrl}${webhookPath}` : webhookPath,
        };
      }),
    })),
  };
}

export async function GET() {
  const response = await backendFetch("/api/v1/admin/integrations/status");
  const data = await parseBackendJson<BackendStatusResponse>(response);

  if (!response.ok || !data.success || !data.data) {
    return NextResponse.json(
      {
        success: false,
        error: data.error?.message ?? "Failed to load integrations status.",
      },
      { status: response.status || 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: enrichWebhookUrls(data.data),
  });
}
