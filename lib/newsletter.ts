const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidNewsletterEmail(email: string): boolean {
  const t = email.trim();
  if (t.length < 5 || t.length > 254) return false;
  return EMAIL_RE.test(t);
}

export function getNewsletterTag(): string | undefined {
  const t = process.env.NEXT_PUBLIC_NEWSLETTER_TAG?.trim();
  return t || undefined;
}

const DEFAULT_TAG = "sbobinature";

export type NewsletterSubscribeMode =
  | { kind: "none" }
  | { kind: "form_post"; actionUrl: string; tag: string };

/**
 * POST verso form embed Buttondown o URL custom (Mailchimp, ecc.).
 * Con username Buttondown: `https://buttondown.com/api/emails/embed-subscribe/{user}`.
 */
export function getNewsletterSubscribeMode(): NewsletterSubscribeMode {
  const customAction = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION?.trim();
  const tag = getNewsletterTag() ?? DEFAULT_TAG;
  if (customAction) {
    return { kind: "form_post", actionUrl: customAction, tag };
  }
  const user = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME?.trim();
  if (!user) {
    return { kind: "none" };
  }
  const actionUrl = `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(user)}`;
  return { kind: "form_post", actionUrl, tag };
}

/** Link “Powered by” / referral (solo flusso Buttondown da username). */
export function getButtondownReferUrl(): string | null {
  const customAction = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION?.trim();
  if (customAction) return null;
  const user = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME?.trim();
  if (!user) return null;
  return `https://buttondown.com/refer/${encodeURIComponent(user)}`;
}
