"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import Button from "@/common/components/Button";
import Checkbox from "@/common/components/Checkbox";
import { mockAdminLogin } from "../mockAdminAuth";
import AdminForgotPasswordModal from "./AdminForgotPasswordModal";
import AdminPasswordInput from "./AdminPasswordInput";
import AuthFieldInput from "./AuthFieldInput";
import { ArrowRightIcon, EnvelopeIcon, GoogleIcon, LoadingSpinner } from "./icons";

type FieldErrors = {
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    () =>
      typeof window !== "undefined" &&
      !!localStorage.getItem("doot-admin-remember-email"),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [email, setEmail] = useState(
    () =>
      (typeof window !== "undefined" &&
        localStorage.getItem("doot-admin-remember-email")) ||
      "",
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);
    const submittedEmail = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const nextErrors: FieldErrors = {};

    if (!submittedEmail) {
      nextErrors.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(submittedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please enter your password.";
    }

    setErrors(nextErrors);
    setFormError(undefined);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const success = await mockAdminLogin(submittedEmail, password);
      if (success) {
        if (rememberMe) {
          localStorage.setItem("doot-admin-remember-email", submittedEmail);
        } else {
          localStorage.removeItem("doot-admin-remember-email");
        }
        router.push("/overview");
      } else {
        setFormError("Incorrect email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor={emailId}
            className="mb-1.5 block text-small font-medium text-foreground"
          >
            Email address
          </label>
          <AuthFieldInput
            id={emailId}
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            error={!!errors.email}
            autoComplete="email"
            leadingIcon={<EnvelopeIcon className="h-[18px] w-[18px]" />}
          />
          {errors.email && (
            <p className="mt-1.5 text-caption text-foreground" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={passwordId}
            className="mb-1.5 block text-small font-medium text-foreground"
          >
            Password
          </label>
          <AdminPasswordInput
            id={passwordId}
            name="password"
            error={!!errors.password}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1.5 text-caption text-foreground" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Checkbox
            id={rememberId}
            name="remember"
            label="Remember me"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="cursor-pointer text-caption font-medium text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/40"
          >
            Forgot password?
          </button>
        </div>

        {formError && (
          <p
            className="rounded-lg border border-border bg-surface/60 px-3 py-2 text-small text-foreground"
            role="alert"
          >
            {formError}
          </p>
        )}

        <Button
          type="submit"
          className="h-[52px] w-full gap-2 rounded-xl text-body font-semibold"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Sign in...
            </>
          ) : (
            <>
              <ArrowRightIcon className="h-4 w-4" />
              Sign in
            </>
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border/80" />
        </div>
        <p className="relative flex justify-center">
          <span className="bg-background px-3 text-caption text-muted-foreground">
            or continue with
          </span>
        </p>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="h-[52px] w-full gap-3 rounded-lg border-border/70 text-body font-medium shadow-none"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-small text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a
          href="mailto:support@doot.com"
          className="font-medium text-accent transition-colors hover:text-accent/80"
        >
          Contact support
        </a>
      </p>

      <AdminForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </>
  );
}
