const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidNewsletterEmail(email: string): boolean {
  const t = email.trim();
  if (t.length < 5 || t.length > 254) return false;
  return EMAIL_RE.test(t);
}

/**
 * URL di invio per l’iscrizione (sito statico, senza API route).
 * - `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION`: URL completo (es. Mailchimp).
 * - oppure `NEXT_PUBLIC_BUTTONDOWN_USERNAME`: usato con l’endpoint embed Buttondown.
 */
export function getNewsletterFormAction(): string | null {
  const full = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION?.trim();
  if (full) return full;
  const user = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME?.trim();
  if (!user) return null;
  const enc = encodeURIComponent(user);
  return `https://buttondown.com/api/emails/embed-subscribe/${enc}`;
}

export function getNewsletterTag(): string | undefined {
  const t = process.env.NEXT_PUBLIC_NEWSLETTER_TAG?.trim();
  return t || undefined;
}
