import nodemailer from "nodemailer";

import { SUPPORT_EMAIL } from "@/lib/site";

export interface ContactSmtpConfig {
  contactEmail: string;
  host: string;
  pass: string;
  port: number;
  secure: boolean;
  startTls: boolean;
  user: string;
}

function parseBooleanEnv(value: string | undefined, fallback: boolean): boolean {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().toLowerCase() === "true";
}

// Loads and normalizes SMTP configuration from environment variables so the
// route handler and development test script use identical transport settings.
export function getContactSmtpConfig(): ContactSmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    secure: parseBooleanEnv(process.env.SMTP_SECURE, port === 465),
    startTls: parseBooleanEnv(process.env.SMTP_STARTTLS, port === 587),
    contactEmail: process.env.CONTACT_EMAIL?.trim() || SUPPORT_EMAIL,
  };
}

export function createContactTransporter(config: ContactSmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.startTls,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      minVersion: "TLSv1.2",
    },
  });
}
