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
  | { kind: "form_post"; actionUrl: string; tag: string }
  | { kind: "buttondown_page"; pageUrl: string };

/**
 * - `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION`: POST su URL esterno (es. Mailchimp).
 * - `NEXT_PUBLIC_BUTTONDOWN_USERNAME`: link alla pagina iscrizione su buttondown.com
 *   (evita `blocked:origin` del POST embed da domini tipo GitHub Pages).
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
  const encUser = encodeURIComponent(user);
  const encTag = encodeURIComponent(tag);
  const pageUrl = `https://buttondown.com/${encUser}?tag=${encTag}`;
  return { kind: "buttondown_page", pageUrl };
}
