"use client";

import { useId, useState, type FormEvent } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/components/Modal";

type AdminForgotPasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminForgotPasswordModal({
  open,
  onClose,
}: AdminForgotPasswordModalProps) {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const handleClose = () => {
    setEmail("");
    setEmailError(undefined);
    setSubmitError(undefined);
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter your email.");
      setSubmitError(undefined);
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      setSubmitError(undefined);
      return;
    }

    setEmailError(undefined);
    setSubmitError(
      "Password reset is not available yet. Contact your platform administrator.",
    );
  };

  return (
    <Modal open={open} onClose={handleClose} title="Forgot your password?">
      <p className="-mt-2 mb-5 text-small text-muted-foreground">
        Admin password reset is not wired to the backend yet.
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
          {submitError && (
            <p className="mt-1.5 text-caption text-foreground" role="status">
              {submitError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full text-body font-semibold sm:flex-1"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            type="submit"
            className="h-11 w-full text-body font-semibold sm:flex-1"
          >
            Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
}
