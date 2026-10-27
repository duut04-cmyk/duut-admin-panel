import type {
  ProviderCredentialField,
  ProviderCredentialsMetadata,
  UpsertProviderCredentialsInput,
} from "@/data/providerTypes";

export const PROVIDER_CREDENTIAL_FIELD_VALUES = [
  "API_KEY",
  "API_SECRET",
  "ACCESS_TOKEN",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "USERNAME",
  "PASSWORD",
  "ACCOUNT_ID",
  "WEBHOOK_SECRET",
] as const satisfies readonly ProviderCredentialField[];

export const CREDENTIAL_FIELD_MAX_LENGTH: Record<ProviderCredentialField, number> = {
  API_KEY: 512,
  API_SECRET: 512,
  ACCESS_TOKEN: 1024,
  CLIENT_ID: 256,
  CLIENT_SECRET: 512,
  USERNAME: 128,
  PASSWORD: 512,
  ACCOUNT_ID: 128,
  WEBHOOK_SECRET: 512,
};

/** Non-secret identifiers may use plain text inputs; secrets use password inputs. */
export const CREDENTIAL_PLAIN_TEXT_FIELDS = new Set<ProviderCredentialField>([
  "CLIENT_ID",
  "USERNAME",
  "ACCOUNT_ID",
]);

export type CredentialFormValues = Record<ProviderCredentialField, string>;

export type CredentialFormFieldErrors = Partial<
  Record<ProviderCredentialField, string>
>;

export function emptyCredentialFormValues(): CredentialFormValues {
  return {
    API_KEY: "",
    API_SECRET: "",
    ACCESS_TOKEN: "",
    CLIENT_ID: "",
    CLIENT_SECRET: "",
    USERNAME: "",
    PASSWORD: "",
    ACCOUNT_ID: "",
    WEBHOOK_SECRET: "",
  };
}

export function credentialFieldUsesPasswordInput(
  field: ProviderCredentialField,
): boolean {
  return !CREDENTIAL_PLAIN_TEXT_FIELDS.has(field);
}

export function formatCredentialFieldLabel(field: ProviderCredentialField): string {
  return field
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function validateCredentialValue(
  field: ProviderCredentialField,
  raw: string,
): string | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  const max = CREDENTIAL_FIELD_MAX_LENGTH[field];
  if (trimmed.length > max) {
    return `${formatCredentialFieldLabel(field)} must be at most ${max} characters.`;
  }
  return null;
}

export function buildCredentialsPutBody(
  form: CredentialFormValues,
):
  | { body: UpsertProviderCredentialsInput }
  | { fieldErrors: CredentialFormFieldErrors; error: string } {
  const fieldErrors: CredentialFormFieldErrors = {};
  const body: UpsertProviderCredentialsInput = {};

  for (const field of PROVIDER_CREDENTIAL_FIELD_VALUES) {
    const trimmed = form[field].trim();
    if (trimmed.length === 0) continue;
    const fieldError = validateCredentialValue(field, form[field]);
    if (fieldError) {
      fieldErrors[field] = fieldError;
      continue;
    }
    body[field] = trimmed;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, error: "Fix the highlighted fields before saving." };
  }

  if (Object.keys(body).length === 0) {
    return {
      fieldErrors: {},
      error: "Enter at least one credential field to save.",
    };
  }

  return { body };
}

export function credentialFieldsBeingRotated(
  body: UpsertProviderCredentialsInput,
  metadata: ProviderCredentialsMetadata,
): ProviderCredentialField[] {
  const configured = new Set(
    metadata.fields.filter((field) => field.configured).map((field) => field.name),
  );
  return PROVIDER_CREDENTIAL_FIELD_VALUES.filter(
    (field) => body[field] !== undefined && configured.has(field),
  );
}

const SAFE_CREDENTIAL_ERROR_FRAGMENTS = [
  "at least one credential",
  "permission",
  "not found",
  "invalid provider",
  "not configured",
  "validation",
  "required",
  "too large",
  "characters",
  "failed to save",
  "failed to update",
];

export function sanitizeCredentialSaveError(message: string | undefined): string {
  const trimmed = (message ?? "").trim();
  if (trimmed.length === 0) {
    return "Failed to save credentials.";
  }
  const lower = trimmed.toLowerCase();
  const looksSafe = SAFE_CREDENTIAL_ERROR_FRAGMENTS.some((fragment) =>
    lower.includes(fragment),
  );
  if (!looksSafe || trimmed.length > 240) {
    return "Failed to save credentials.";
  }
  return trimmed;
}

/** Ensures draft values are never initialized from server metadata (write-only). */
export function credentialFormValuesFromMetadata(
  metadata: ProviderCredentialsMetadata,
): CredentialFormValues {
  void metadata;
  return emptyCredentialFormValues();
}
