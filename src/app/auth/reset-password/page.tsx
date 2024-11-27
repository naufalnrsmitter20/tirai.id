"use client";

import { useState } from "react";
import { ResetPasswordEmailForm } from "./components/forms/reset-password-email-form";
import { HasSentWarning } from "./components/has-sent-warning";

export default function ResetPasswordConfirmation() {
  const [loading, setLoading] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [hasSentEmail, setHasSentEmail] = useState<string>();

  return (
    <section className="flex w-full max-w-full flex-col items-center">
      {hasSent && hasSentEmail ? (
        <HasSentWarning
          email={hasSentEmail}
          loading={loading}
          setLoading={setLoading}
        />
      ) : (
        <ResetPasswordEmailForm
          loading={loading}
          setLoading={setLoading}
          setHasSent={setHasSent}
          setHasSentEmail={setHasSentEmail}
        />
      )}
    </section>
  );
}
