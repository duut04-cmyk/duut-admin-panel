"use client";

import { useId, useState } from "react";
import AuthFieldInput from "./AuthFieldInput";
import { EyeClosedIcon, EyeOpenIcon, LockIcon } from "./icons";

type AdminPasswordInputProps = {
  id?: string;
  name: string;
  placeholder?: string;
  error?: boolean;
  autoComplete?: string;
};

export default function AdminPasswordInput({
  id: idProp,
  name,
  placeholder = "Enter your password",
  error = false,
  autoComplete = "current-password",
}: AdminPasswordInputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <AuthFieldInput
      id={id}
      name={name}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      error={error}
      autoComplete={autoComplete}
      leadingIcon={<LockIcon className="h-[18px] w-[18px]" />}
      trailingSlot={
        <button
          type="button"
          className="cursor-pointer rounded-control p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          onClick={() => setVisible((value) => !value)}
          onMouseDown={(event) => event.preventDefault()}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOpenIcon className="h-5 w-5" />
          ) : (
            <EyeClosedIcon className="h-5 w-5" />
          )}
        </button>
      }
    />
  );
}
