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

const DEFAULT_SMTP_PORT = 587;

function parseBooleanEnv(value: string | undefined, fallback: boolean): boolean {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().toLowerCase() === "true";
}

// Reports which SMTP variables are missing or invalid so server logs can point
// directly to the deployment configuration problem without exposing secrets.
export function getMissingContactEnvKeys(): string[] {
  const missingKeys: string[] = [];
  const host = process.env.SMTP_HOST?.trim();
  const portValue = process.env.SMTP_PORT?.trim();
  const port = Number(portValue ?? DEFAULT_SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;

  if (!host) {
    missingKeys.push("SMTP_HOST");
  }

  if (portValue && Number.isNaN(port)) {
    missingKeys.push("SMTP_PORT");
  }

  if (!user) {
    missingKeys.push("SMTP_USER");
  }

  if (!pass) {
    missingKeys.push("SMTP_PASS");
  }

  return missingKeys;
}

// Loads and normalizes SMTP configuration from environment variables so the
// route handler and development test script use identical transport settings.
export function getContactSmtpConfig(): ContactSmtpConfig | null {
  if (getMissingContactEnvKeys().length > 0) {
    return null;
  }

  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT ?? DEFAULT_SMTP_PORT);
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!;

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
