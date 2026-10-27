"use client";

import { useState } from "react";
import type { ProviderDetail } from "@/data/providerTypes";
import Button from "@/common/components/Button";
import Modal from "@/common/components/Modal";
import AdminCallout from "@/ui/AdminCallout";
import AdminStatus from "@/ui/AdminStatus";
import { fetchProvider, testProviderConnection } from "../api";
import type { ProviderConnectionTestResult } from "../providerConnectionDiagnostics";
import {
  isTestConnectionActionAvailable,
  sanitizeTestConnectionError,
  testConnectionDisabledReason,
} from "../providerConnectionDiagnostics";
import ProviderEnvironmentBadge from "./ProviderEnvironmentBadge";
import { environmentLabel } from "./utils";

type ProviderDiagnosticsSectionProps = {
  provider: ProviderDetail;
  onProviderUpdated: (provider: ProviderDetail) => void;
};

function ConfirmTestConnectionModal({
  open,
  onClose,
  onConfirm,
  confirming,
  provider,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirming: boolean;
  provider: ProviderDetail;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Run connection test?">
      <p className="text-small text-muted-foreground">
        This runs the provider adapter&apos;s <strong>health check</strong> operation
        only. It does not verify quote, booking, tracking, cancellation, or refunds.
      </p>
      <ul className="mt-4 space-y-2 text-small">
        <li>
          <strong>Provider:</strong> {provider.name}{" "}
          <span className="font-mono text-caption">({provider.code})</span>
        </li>
        <li className="flex flex-wrap items-center gap-2">
          <strong>Environment:</strong>
          <ProviderEnvironmentBadge environment={provider.environment} />
          <span className="text-muted-foreground">
            ({environmentLabel(provider.environment)})
          </span>
        </li>
      </ul>
      <p className="mt-4 text-small text-foreground">
        The check may contact the provider&apos;s API (depending on adapter) and will
        update this provider&apos;s recorded health and integration status on the server
        when the test completes.
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={confirming}
        >
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} disabled={confirming}>
          {confirming ? "Testing…" : "Run test"}
        </Button>
      </div>
    </Modal>
  );
}

function OutcomeSummary({ result }: { result: ProviderConnectionTestResult }) {
  return (
    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
      <div>
        <dt className="text-caption font-medium text-muted-foreground">Outcome</dt>
        <dd className="mt-1">
          <AdminStatus
            variant={result.connected ? "success" : "failed"}
            label={result.connected ? "Connected" : "Not connected"}
          />
        </dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">Latency</dt>
        <dd className="mt-1 text-small tabular-nums">{result.latencyMs} ms</dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">
          Provider code
        </dt>
        <dd className="mt-1 font-mono text-caption">{result.providerCode}</dd>
      </div>
      <div>
        <dt className="text-caption font-medium text-muted-foreground">Environment</dt>
        <dd className="mt-1 text-small">{result.environment}</dd>
      </div>
    </dl>
  );
}

export default function ProviderDiagnosticsSection({
  provider,
  onProviderUpdated,
}: ProviderDiagnosticsSectionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ProviderConnectionTestResult | null>(
    null,
  );

  const disabledReason = testConnectionDisabledReason(provider);
  const canRun = isTestConnectionActionAvailable(provider);

  const runTest = async () => {
    if (testing || !canRun) return;
    setTesting(true);
    setRequestError(null);

    const result = await testProviderConnection(provider.id);

    if (!result.success || !result.data) {
      setTesting(false);
      setConfirmOpen(false);
      setRequestError(sanitizeTestConnectionError(result.error));
      return;
    }

    setLastResult(result.data);

    const refreshed = await fetchProvider(provider.id);
    setTesting(false);
    setConfirmOpen(false);

    if (refreshed.success && refreshed.data) {
      onProviderUpdated(refreshed.data);
    }
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 lg:px-6">
        <div>
          <h2 className="text-subheading font-semibold leading-snug text-foreground">
            Diagnostics
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Manual adapter health check. Results update stored health status after the
            server responds. Tests are not run automatically.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ProviderEnvironmentBadge environment={provider.environment} />
          <Button
            type="button"
            variant="secondary"
            disabled={!canRun || testing}
            onClick={() => {
              setRequestError(null);
              setConfirmOpen(true);
            }}
          >
            {testing ? "Testing…" : "Test connection"}
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {!canRun && disabledReason ? (
          <AdminCallout variant="neutral" title="Test unavailable" className="mb-4">
            {disabledReason}
          </AdminCallout>
        ) : null}

        {requestError ? (
          <AdminCallout
            variant="warning"
            title="Could not complete test"
            className="mb-4"
          >
            {requestError}
            <Button
              type="button"
              className="mt-3"
              variant="secondary"
              disabled={testing}
              onClick={() => {
                setRequestError(null);
                setConfirmOpen(true);
              }}
            >
              Retry
            </Button>
          </AdminCallout>
        ) : null}

        {lastResult ? (
          <div className="rounded-md border border-border/60 bg-surface/40 p-4">
            <p className="text-small font-medium text-foreground">Latest test result</p>
            <p className="mt-1 text-caption text-muted-foreground">
              A successful authentication or health response does not prove quote,
              booking, or other operations work.
            </p>
            <OutcomeSummary result={lastResult} />
            {lastResult.connected ? null : (
              <Button
                type="button"
                className="mt-4"
                variant="secondary"
                disabled={testing || !canRun}
                onClick={() => setConfirmOpen(true)}
              >
                Retry test
              </Button>
            )}
          </div>
        ) : (
          <p className="text-small text-muted-foreground">
            No connection test has been run in this session. Confirm before each test.
          </p>
        )}
      </div>

      <ConfirmTestConnectionModal
        open={confirmOpen}
        onClose={() => {
          if (testing) return;
          setConfirmOpen(false);
        }}
        onConfirm={() => void runTest()}
        confirming={testing}
        provider={provider}
      />
    </section>
  );
}
