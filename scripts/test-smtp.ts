import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

import {
  createContactTransporter,
  getContactSmtpConfig,
} from "../lib/contact-mailer";

function loadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) {
    return;
  }

  const contents = readFileSync(filePath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1);

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function main(): Promise<void> {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  ) {
    throw new Error("SMTP verification is disabled in production.");
  }

  loadEnvFile(path.resolve(process.cwd(), ".env.local"));

  const smtpConfig = getContactSmtpConfig();

  if (!smtpConfig) {
    throw new Error("SMTP configuration is missing. Check your .env.local file.");
  }

  const transporter = createContactTransporter(smtpConfig);

  await transporter.verify();

  console.log("[smtp] connection verified", {
    host: smtpConfig.host,
    port: smtpConfig.port,
    user: smtpConfig.user,
    mailFrom: smtpConfig.mailFrom,
    mailTo: smtpConfig.mailTo,
  });
}

void main().catch((error: unknown) => {
  console.error("[smtp] verification failed", error);
  process.exitCode = 1;
});
