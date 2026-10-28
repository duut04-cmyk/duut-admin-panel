"use client";

import ProviderConfigurationSection from "../../components/ProviderConfigurationSection";
import ProviderSubpageHeader from "../../components/ProviderSubpageHeader";
import ProviderDetailRouteShell from "../ProviderDetailRouteShell";
import { useProviderDetail } from "../useProviderDetail";

type ProviderEditPageProps = {
  providerId: string;
};

export default function ProviderEditPage({ providerId }: ProviderEditPageProps) {
  const { provider, setProvider, loading, loadError, invalidId, retryLoad, retrying } =
    useProviderDetail(providerId);

  return (
    <ProviderDetailRouteShell
      providerId={providerId}
      invalidId={invalidId}
      loading={loading}
      provider={provider}
      loadError={loadError}
      retryLoad={() => void retryLoad()}
      retrying={retrying}
      mainClassName="bg-background"
      containerClassName="max-w-3xl space-y-6 pb-10"
      customHeader={
        provider ? (
          <ProviderSubpageHeader
            provider={provider}
            title="Edit provider details"
            description="Update profile fields and orchestration participation. Lifecycle status is managed on the provider overview page."
          />
        ) : undefined
      }
    >
      {(loaded) => (
        <ProviderConfigurationSection
          key={loaded.id}
          mode="edit"
          provider={loaded}
          onProviderUpdated={setProvider}
        />
      )}
    </ProviderDetailRouteShell>
  );
}
