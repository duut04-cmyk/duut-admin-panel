"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { mockAdminLogin } from "../mockAdminAuth";
import AdminForgotPasswordModal from "./AdminForgotPasswordModal";
import AdminPasswordInput from "./AdminPasswordInput";
import { LoadingSpinner } from "./icons";

type FieldErrors = {
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [forgotOpen, setForgotOpen] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const nextErrors: FieldErrors = {};

    if (!email) {
      nextErrors.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(email)) {
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
      const success = await mockAdminLogin(email, password);
      if (success) {
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
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor={emailId}
            className="mb-1.5 block text-small font-medium text-foreground"
          >
            Email
          </label>
          <Input
            id={emailId}
            name="email"
            type="email"
            placeholder="you@company.com"
            error={!!errors.email}
            autoComplete="email"
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
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="cursor-pointer text-caption font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {formError && (
          <p
            className="rounded-md border border-border bg-surface/60 px-3 py-2 text-small text-foreground"
            role="alert"
          >
            {formError}
          </p>
        )}

        <Button
          type="submit"
          className="h-11 w-full gap-2 text-body font-semibold"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Sign in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <AdminForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </>
  );
}
