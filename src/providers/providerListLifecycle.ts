import type {
  ProviderDetail,
  ProviderSummary,
  UpdateProviderInput,
  UpdateProviderStatusInput,
} from "@/data/providerTypes";

type LifecycleApiResult = {
  success: boolean;
  data?: ProviderDetail;
  error?: string;
};

export type ListEnabledLifecycleDeps = {
  updateProviderStatus: (
    providerId: string,
    input: UpdateProviderStatusInput,
  ) => Promise<LifecycleApiResult>;
  updateProvider: (
    providerId: string,
    input: UpdateProviderInput,
  ) => Promise<LifecycleApiResult>;
};

export type ListEnabledChangeStep =
  | { kind: "status"; body: UpdateProviderStatusInput }
  | { kind: "orchestrationOff"; body: { orchestrationEnabled: false } };

export function providerSummaryFromDetail(detail: ProviderDetail): ProviderSummary {
  const { description, settings, packageLimits, services, vehicles, ...summary } =
    detail;
  void description;
  void settings;
  void packageLimits;
  void services;
  void vehicles;
  return summary;
}

export function planListEnabledChange(
  provider: Pick<ProviderSummary, "orchestrationEnabled">,
  enabled: boolean,
): ListEnabledChangeStep[] {
  if (enabled) {
    return [{ kind: "status", body: { status: "ACTIVE" } }];
  }

  const steps: ListEnabledChangeStep[] = [
    { kind: "status", body: { status: "INACTIVE" } },
  ];
  if (provider.orchestrationEnabled) {
    steps.push({ kind: "orchestrationOff", body: { orchestrationEnabled: false } });
  }
  return steps;
}

export async function setProviderEnabledFromList(
  provider: ProviderSummary,
  enabled: boolean,
  deps: ListEnabledLifecycleDeps,
): Promise<
  { success: true; data: ProviderDetail } | { success: false; error?: string }
> {
  const steps = planListEnabledChange(provider, enabled);

  let lastDetail: ProviderDetail | undefined;

  for (const step of steps) {
    if (step.kind === "status") {
      const result = await deps.updateProviderStatus(provider.id, step.body);
      if (!result.success || !result.data) {
        return { success: false, error: result.error };
      }
      lastDetail = result.data;
      continue;
    }

    const result = await deps.updateProvider(provider.id, step.body);
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }
    lastDetail = result.data;
  }

  if (!lastDetail) {
    return { success: false, error: "Failed to update provider." };
  }

  return { success: true, data: lastDetail };
}
