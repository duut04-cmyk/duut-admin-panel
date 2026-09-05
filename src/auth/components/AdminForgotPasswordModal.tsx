"use client";

import { useId, useState, type FormEvent } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/components/Modal";
import { mockAdminPasswordReset } from "../mockAdminAuth";
import { LoadingSpinner } from "./icons";

type AdminForgotPasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

type Step = "form" | "success";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminForgotPasswordModal({
  open,
  onClose,
}: AdminForgotPasswordModalProps) {
  const emailId = useId();
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setStep("form");
    setEmail("");
    setEmailError(undefined);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter your email.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError(undefined);
    setLoading(true);
    try {
      await mockAdminPasswordReset(500);
      setStep("success");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <Modal open={open} onClose={handleClose}>
        <div className="space-y-4">
          <h2 className="text-subheading font-semibold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="text-small text-muted-foreground">
            If an account exists for this email, we&apos;ve sent instructions to
            reset your password.
          </p>
          <Button
            type="button"
            className="h-11 w-full text-body font-semibold"
            onClick={handleClose}
          >
            Done
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} title="Forgot your password?">
      <p className="-mt-2 mb-5 text-small text-muted-foreground">
        Enter your admin email and we&apos;ll send you a password reset link.
      </p>

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
            name="reset-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={!!emailError}
            autoComplete="email"
          />
          {emailError && (
            <p className="mt-1.5 text-caption text-foreground" role="alert">
              {emailError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full text-body font-semibold sm:flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 w-full gap-2 text-body font-semibold sm:flex-1"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
