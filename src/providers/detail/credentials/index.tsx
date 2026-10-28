"use client";

import ProviderCredentialsSection from "../../components/ProviderCredentialsSection";
import ProviderSubpageHeader from "../../components/ProviderSubpageHeader";
import ProviderDetailRouteShell from "../ProviderDetailRouteShell";
import { useProviderDetail } from "../useProviderDetail";

type ProviderCredentialsPageProps = {
  providerId: string;
};

export default function ProviderCredentialsPage({
  providerId,
}: ProviderCredentialsPageProps) {
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
      containerClassName="max-w-2xl space-y-6 pb-10"
      customHeader={
        provider ? (
          <ProviderSubpageHeader
            provider={provider}
            title="Update credentials"
            description="Secrets are write-only and encrypted. Only fields you enter are updated; blank fields keep their stored values."
          />
        ) : undefined
      }
    >
      {(loaded) => (
        <ProviderCredentialsSection
          mode="edit"
          provider={loaded}
          onProviderUpdated={setProvider}
        />
      )}
    </ProviderDetailRouteShell>
  );
}
