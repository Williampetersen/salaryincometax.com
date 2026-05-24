"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { SUPPORT_EMAIL } from "@/lib/site";

interface ContactFormState {
  consent: boolean;
  email: string;
  honey: string;
  message: string;
  name: string;
  subject: string;
}

const INITIAL_STATE: ContactFormState = {
  consent: false,
  email: "",
  honey: "",
  message: "",
  name: "",
  subject: "",
};

// Client-side contact form with validation, honeypot support, and a clear
// success/error state for AdSense trust requirements.
export function ContactForm(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<{
    message: string;
    status: "error" | "success";
  } | null>(null);

  function updateField<K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K],
  ): void {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function validateForm(): string | null {
    if (!formState.name.trim()) {
      return "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (formState.subject.trim().length < 3) {
      return "Please provide a short subject.";
    }

    if (formState.message.trim().length < 20) {
      return "Please provide a more detailed message.";
    }

    if (!formState.consent) {
      return "Please confirm that we may use your information to respond.";
    }

    return null;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setFeedback({
        status: "error",
        message: validationError,
      });
      return;
    }

    setFeedback(null);

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        });

        const payload = (await response.json()) as {
          error?: string;
          success?: boolean;
        };

        if (!response.ok || !payload.success) {
          setFeedback({
            status: "error",
            message:
              payload.error ??
              "We could not send your message right now. Please try again later.",
          });
          return;
        }

        setFormState(INITIAL_STATE);
        setFeedback({
          status: "success",
          message:
            "Your message has been sent. We will respond to your inquiry as soon as possible.",
        });
      })();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
      <form className="panel p-5 sm:p-7" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="contact-name">
              Name
            </label>
            <input
              className="form-control"
              id="contact-name"
              maxLength={120}
              onChange={(event) => updateField("name", event.target.value)}
              required
              type="text"
              value={formState.name}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="contact-email">
              Email
            </label>
            <input
              className="form-control"
              id="contact-email"
              maxLength={180}
              onChange={(event) => updateField("email", event.target.value)}
              required
              type="email"
              value={formState.email}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="contact-subject">
              Subject
            </label>
            <input
              className="form-control"
              id="contact-subject"
              maxLength={150}
              onChange={(event) => updateField("subject", event.target.value)}
              required
              type="text"
              value={formState.subject}
            />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-company">Company</label>
            <input
              autoComplete="off"
              id="contact-company"
              onChange={(event) => updateField("honey", event.target.value)}
              tabIndex={-1}
              type="text"
              value={formState.honey}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="contact-message">
              Message
            </label>
            <textarea
              className="form-control min-h-[10rem]"
              id="contact-message"
              maxLength={5000}
              onChange={(event) => updateField("message", event.target.value)}
              required
              value={formState.message}
            />
          </div>
          <label className="sm:col-span-2 flex items-start gap-3 rounded-3xl border border-ink/10 bg-white/80 p-4 text-sm text-ink/72">
            <input
              checked={formState.consent}
              className="mt-1 h-4 w-4 rounded border-ink/20 text-coral focus:ring-coral/20"
              onChange={(event) => updateField("consent", event.target.checked)}
              required
              type="checkbox"
            />
            <span>
              I agree that my submitted information may be used to respond to my
              inquiry.
            </span>
          </label>
        </div>

        {feedback ? (
          <div
            className={`mt-4 rounded-3xl px-4 py-3 text-sm ${
              feedback.status === "success"
                ? "border border-moss/20 bg-moss/10 text-moss"
                : "border border-coral/25 bg-coral/8 text-coral"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <button
          className="mt-5 inline-flex items-center justify-center rounded-3xl bg-ink px-5 py-4 font-semibold text-white transition hover:bg-coral disabled:cursor-wait disabled:opacity-70"
          data-analytics-action="contact_click"
          data-analytics-category="engagement"
          data-analytics-label="contact-form-submit"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Sending..." : "Send message"}
        </button>
      </form>

      <div className="panel p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
          Contact details
        </p>
        <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
          Reach the editorial and support team
        </h2>
        <p className="mt-4 text-sm leading-7 text-ink/70">
          Use the form for calculator issues, correction requests, partnership
          questions, or general feedback. You can also email us directly.
        </p>
        <div className="mt-5 rounded-3xl border border-ink/10 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/50">
            Support email
          </p>
          <Link
            className="mt-2 inline-flex text-lg font-semibold text-coral transition hover:text-ink"
            data-analytics-action="contact_click"
            data-analytics-category="engagement"
            data-analytics-label="contact-email-link"
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            {SUPPORT_EMAIL}
          </Link>
        </div>
        <div className="mt-5 rounded-3xl border border-ink/10 bg-paper/55 p-4 text-sm leading-7 text-ink/68">
          <p className="font-semibold text-ink">Response expectations</p>
          <p className="mt-2">
            We use submitted information only to evaluate and respond to your
            request, plus any necessary follow-up related to that request.
          </p>
          <p className="mt-2">
            Review the{" "}
            <Link className="text-coral hover:text-ink" href="/privacy-policy">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="text-coral hover:text-ink" href="/cookie-policy">
              Cookie Policy
            </Link>{" "}
            for more detail.
          </p>
        </div>
      </div>
    </div>
  );
}
