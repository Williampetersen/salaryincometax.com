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
  subject?: string;
}

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

  if (!payload.subject || sanitizeText(payload.subject).length < 3) {
    return "Please provide a valid subject.";
  }

  if (!payload.message || sanitizeText(payload.message).length < 20) {
    return "Please provide a more detailed message.";
  }

  if (!payload.consent) {
    return "Consent is required before sending the form.";
  }

  return null;
}

// Server-side contact endpoint with validation, sanitization, and honeypot
// spam protection. SMTP credentials stay server-side only.
export async function POST(request: Request): Promise<Response> {
  const payload = (await request.json()) as ContactPayload;

  if (payload.honey && payload.honey.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const validationError = validatePayload(payload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const sanitizedName = sanitizeText(payload.name ?? "");
  const sanitizedEmail = sanitizeText(payload.email ?? "");
  const sanitizedSubject = sanitizeText(payload.subject ?? "");
  const sanitizedMessage = sanitizeText(payload.message ?? "");
  const smtpConfig = getContactSmtpConfig();

  if (!smtpConfig) {
    const missingKeys = getMissingContactEnvKeys();

    console.error(
      `[contact] SMTP environment variables are missing or invalid: ${missingKeys.join(", ") || "unknown"}`,
    );

    return NextResponse.json(
      {
        success: false,
        errorCode: "CONTACT_NOT_CONFIGURED",
        error:
          "The contact form is temporarily unavailable. Please email support@salaryincometax.com directly while we finish the mail setup.",
        supportEmail: SUPPORT_EMAIL,
      },
      { status: 503 },
    );
  }

  const transporter = createContactTransporter(smtpConfig);

  try {
    await transporter.sendMail({
      from: `"Salary Income Tax Contact" <${smtpConfig.user}>`,
      to: smtpConfig.contactEmail,
      replyTo: sanitizedEmail,
      subject: `[Contact] ${sanitizedSubject}`,
      text: [
        `Name: ${sanitizedName}`,
        `Email: ${sanitizedEmail}`,
        `Subject: ${sanitizedSubject}`,
        "",
        sanitizedMessage,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(sanitizedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(sanitizedSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(sanitizedMessage).replace(/\n/g, "<br />")}</p>
      `,
    });

    await transporter.sendMail({
      from: `"Salary Income Tax" <${smtpConfig.user}>`,
      to: sanitizedEmail,
      replyTo: smtpConfig.contactEmail,
      subject: "We received your message",
      text: [
        `Hello ${sanitizedName},`,
        "",
        "Thank you for contacting salaryincometax.com.",
        "We received your message and will review it as soon as possible.",
        "",
        `Subject: ${sanitizedSubject}`,
        "",
        "If you need to add more information, reply to this email.",
        "",
        `Support: ${smtpConfig.contactEmail}`,
      ].join("\n"),
      html: `
        <p>Hello ${escapeHtml(sanitizedName)},</p>
        <p>Thank you for contacting salaryincometax.com.</p>
        <p>We received your message and will review it as soon as possible.</p>
        <p><strong>Subject:</strong> ${escapeHtml(sanitizedSubject)}</p>
        <p>If you need to add more information, reply to this email.</p>
        <p><strong>Support:</strong> ${escapeHtml(smtpConfig.contactEmail)}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Your message was sent successfully. A confirmation email has also been sent to you.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[contact] failed to send email", error);
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "We could not send your message right now. Please try again later, or email support@salaryincometax.com directly.",
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
