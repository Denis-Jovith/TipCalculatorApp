import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined
    });
  }
  return transporter;
}

export async function sendContactNotification({ name, email, subject, message }) {
  const t = getTransporter();
  if (!t) return false; // SMTP not configured — message is still saved to the DB/admin inbox.

  await t.sendMail({
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER,
    replyTo: email,
    subject: `[Portfolio] ${subject || 'New message from ' + name}`,
    text: `From: ${name} <${email}>\n\n${message}`
  });
  return true;
}

// Returns false (rather than throwing) whenever SMTP isn't configured, so callers in the
// auth flow can still respond successfully in dev/sandbox environments without email set up.
export async function sendAdminInviteEmail({ to, name, inviterName, acceptUrl }) {
  const t = getTransporter();
  if (!t) return false;

  await t.sendMail({
    from: `"${inviterName || 'Portfolio Admin'}" <${process.env.SMTP_USER}>`,
    to,
    subject: "You've been invited to the Portfolio admin",
    text:
      `Hi ${name},\n\n${inviterName || 'An admin'} invited you to manage the portfolio site.\n\n` +
      `Set your password and verify your email here (link expires in 48 hours):\n${acceptUrl}\n\n` +
      `If you weren't expecting this, you can ignore this email.`
  });
  return true;
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const t = getTransporter();
  if (!t) return false;

  await t.sendMail({
    from: `"Portfolio Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your Portfolio admin password',
    text:
      `Hi ${name},\n\nA password reset was requested for your admin account.\n\n` +
      `Reset it here (link expires in 1 hour):\n${resetUrl}\n\n` +
      `If you didn't request this, you can safely ignore this email — your password won't change.`
  });
  return true;
}
