import nodemailer from "nodemailer";

import { SUPPORT_EMAIL } from "@/lib/site";

export interface ContactSmtpConfig {
  host: string;
  mailFrom: string;
  mailTo: string;
  pass: string;
  port: number;
  user: string;
}

const DEFAULT_SMTP_PORT = 587;

// Reports which SMTP variables are missing or invalid so server logs can point
// directly to the deployment configuration problem without exposing secrets.
export function getMissingContactEnvKeys(): string[] {
  const missingKeys: string[] = [];
  const host = process.env.SMTP_HOST?.trim();
  const portValue = process.env.SMTP_PORT?.trim();
  const port = Number(portValue ?? DEFAULT_SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS;

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
    missingKeys.push("SMTP_PASSWORD");
  }

  return missingKeys;
}

// Loads and normalizes SMTP configuration from environment variables so the
// route handler and development test script use identical transport settings.
export function getContactSmtpConfig(): ContactSmtpConfig | null {
  if (getMissingContactEnvKeys().length > 0) {
    return null;
  }

  return {
    host: process.env.SMTP_HOST!.trim(),
    port: Number(process.env.SMTP_PORT ?? DEFAULT_SMTP_PORT),
    user: process.env.SMTP_USER!.trim(),
    pass: process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS!,
    mailFrom:
      process.env.MAIL_FROM?.trim() ||
      process.env.CONTACT_EMAIL?.trim() ||
      process.env.SMTP_USER?.trim() ||
      SUPPORT_EMAIL,
    mailTo:
      process.env.MAIL_TO?.trim() ||
      process.env.CONTACT_EMAIL?.trim() ||
      SUPPORT_EMAIL,
  };
}

export function createContactTransporter(config: ContactSmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    // Simply.com uses authenticated SMTP with STARTTLS on port 587.
    secure: false,
    requireTLS: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      minVersion: "TLSv1.2",
    },
  });
}
