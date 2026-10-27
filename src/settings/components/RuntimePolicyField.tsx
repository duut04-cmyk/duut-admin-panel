import Input from "@/common/components/Input";
import AdminCallout from "@/ui/AdminCallout";

type RuntimePolicyFieldProps = {
  label: string;
  unit: string;
  envHint: string;
  effectiveDisplay: string;
  sourceLabel: string;
  version: number;
  restartRequired: boolean;
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  invalidOverrideMessage?: string | null;
};

export default function RuntimePolicyField({
  label,
  unit,
  envHint,
  effectiveDisplay,
  sourceLabel,
  version,
  restartRequired,
  inputId,
  value,
  onChange,
  error,
  disabled,
  invalidOverrideMessage,
}: RuntimePolicyFieldProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-background p-4">
      <div className="space-y-1">
        <label htmlFor={inputId} className="text-small font-semibold text-foreground">
          {label}
        </label>
        <p className="text-caption text-muted-foreground">
          Effective: {effectiveDisplay} · Source: {sourceLabel} · Version v{version} ·{" "}
          {restartRequired ? "Restart required" : "No restart required"} ·{" "}
          <span className="font-mono">{envHint}</span>
        </p>
      </div>

      {invalidOverrideMessage ? (
        <AdminCallout variant="warning" title="Invalid stored override">
          {invalidOverrideMessage}
        </AdminCallout>
      ) : null}

      <Input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={unit === "seconds" ? 1 : 0}
        max={unit === "percent" ? 100 : undefined}
        step={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        error={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      <p className="text-caption text-muted-foreground">Unit: {unit}</p>
      {error ? (
        <p
          id={`${inputId}-error`}
          className="text-caption text-foreground"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
