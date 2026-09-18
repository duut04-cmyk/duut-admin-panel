export type IntegrationStatus =
  "connected" | "not_configured" | "degraded" | "coming_soon";

export type IntegrationCategoryId =
  "identity" | "communications" | "infrastructure" | "webhooks" | "security";

export type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategoryId;
  status: IntegrationStatus;
  statusLabel: string;
  usedBy: string;
  impact: string;
  metadata: Record<string, string>;
  manageHref: string | null;
  webhookUrl?: string;
};

export type IntegrationCategory = {
  id: IntegrationCategoryId;
  title: string;
  description: string;
  items: IntegrationItem[];
};

export type IntegrationSummary = {
  connected: number;
  total: number;
  needsAttention: number;
};

export type IntegrationsStatus = {
  summary: IntegrationSummary;
  categories: IntegrationCategory[];
  checkedAt: string;
};
