// lib/brevo.ts
import nodemailer from "nodemailer";

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    console.warn("GMAIL_USER o GMAIL_PASSWORD no configurados. Saltando envío de email.");
    return;
  }

  return gmailTransporter.sendMail({
    from: `EnmaStay <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}