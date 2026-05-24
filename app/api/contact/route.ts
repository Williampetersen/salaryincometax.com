import { NextResponse } from "next/server";

import {
  createContactTransporter,
  getContactSmtpConfig,
  getMissingContactEnvKeys,
} from "@/lib/contact-mailer";
import { SUPPORT_EMAIL } from "@/lib/site";

export const runtime = "nodejs";

interface ContactPayload {
  consent?: boolean;
  email?: string;
  honey?: string;
  message?: string;
  name?: string;
  phone?: string;
  subject?: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const rateLimitStore = new Map<string, RateLimitEntry>();

function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePayload(payload: ContactPayload): string | null {
  if (!payload.name || sanitizeText(payload.name).length < 2) {
    return "Please enter your name.";
  }

  if (!payload.email || !isValidEmail(sanitizeText(payload.email))) {
    return "Please enter a valid email address.";
  }

  if (!payload.message || sanitizeText(payload.message).length < 1) {
    return "Please enter your message.";
  }

  if (!payload.consent) {
    return "Consent is required before sending the form.";
  }

  return null;
}

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return realIp?.trim() || "unknown";
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  const existingEntry = rateLimitStore.get(identifier);

  if (!existingEntry) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (existingEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existingEntry.count += 1;
  rateLimitStore.set(identifier, existingEntry);
  return false;
}

// Server-side contact endpoint with validation, sanitization, honeypot spam
// protection, and a basic in-memory rate limit. SMTP credentials stay
// server-side only.
export async function POST(request: Request): Promise<Response> {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Sorry, your message could not be sent. Please try again later.",
      },
      { status: 400 },
    );
  }

  const clientIdentifier = getClientIdentifier(request);

  if (payload.honey && payload.honey.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  if (isRateLimited(clientIdentifier)) {
    return NextResponse.json(
      {
        success: false,
        error: "Sorry, your message could not be sent. Please try again later.",
      },
      { status: 429 },
    );
  }

  const validationError = validatePayload(payload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const sanitizedName = sanitizeText(payload.name ?? "");
  const sanitizedEmail = sanitizeText(payload.email ?? "");
  const sanitizedPhone = sanitizeText(payload.phone ?? "");
  const sanitizedSubject =
    sanitizeText(payload.subject ?? "") || "Website contact form";
  const sanitizedMessage = sanitizeText(payload.message ?? "");
  const smtpConfig = getContactSmtpConfig();

  if (!smtpConfig) {
    const missingKeys = getMissingContactEnvKeys();

    console.error(
      `[contact] SMTP environment variables are missing or invalid for ${request.headers.get("host") ?? "unknown-host"}: ${missingKeys.join(", ") || "unknown"}`,
    );

    return NextResponse.json(
      {
        success: false,
        errorCode: "CONTACT_NOT_CONFIGURED",
        error: "Sorry, your message could not be sent. Please try again later.",
        supportEmail: SUPPORT_EMAIL,
      },
      { status: 503 },
    );
  }

  const transporter = createContactTransporter(smtpConfig);

  try {
    await transporter.sendMail({
      from: `"Salary Income Tax Contact" <${smtpConfig.mailFrom}>`,
      to: smtpConfig.mailTo,
      replyTo: sanitizedEmail,
      subject: `[Contact] ${sanitizedSubject}`,
      text: [
        `Full name: ${sanitizedName}`,
        `Email: ${sanitizedEmail}`,
        `Phone number: ${sanitizedPhone || "Not provided"}`,
        `Subject: ${sanitizedSubject}`,
        "",
        sanitizedMessage,
      ].join("\n"),
      html: `
        <p><strong>Full name:</strong> ${escapeHtml(sanitizedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
        <p><strong>Phone number:</strong> ${escapeHtml(sanitizedPhone || "Not provided")}</p>
        <p><strong>Subject:</strong> ${escapeHtml(sanitizedSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(sanitizedMessage).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (isValidEmail(sanitizedEmail)) {
      try {
        await transporter.sendMail({
          from: `"Salary Income Tax" <${smtpConfig.mailFrom}>`,
          to: sanitizedEmail,
          replyTo: smtpConfig.mailFrom,
          subject: "Thank you for contacting Salary Income Tax",
          text: [
            `Hi ${sanitizedName},`,
            "",
            "Thank you for contacting Salary Income Tax.",
            "",
            "We have received your message and will get back to you as soon as possible.",
            "",
            "Best regards,",
            "Salary Income Tax",
            smtpConfig.mailFrom,
          ].join("\n"),
          html: `
            <p>Hi ${escapeHtml(sanitizedName)},</p>
            <p>Thank you for contacting Salary Income Tax.</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br />Salary Income Tax<br />${escapeHtml(smtpConfig.mailFrom)}</p>
          `,
        });
      } catch (error) {
        console.error("[contact] auto-reply email failed", {
          host: request.headers.get("host") ?? "unknown-host",
          message: error instanceof Error ? error.message : "unknown error",
          name: error instanceof Error ? error.name : "UnknownError",
          visitorEmail: sanitizedEmail,
        });
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("[contact] failed to send email", {
      host: request.headers.get("host") ?? "unknown-host",
      message: error instanceof Error ? error.message : "unknown error",
      name: error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Sorry, your message could not be sent. Please try again later.",
        supportEmail: SUPPORT_EMAIL,
      },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
