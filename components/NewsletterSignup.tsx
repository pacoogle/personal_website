"use client";

import { useId, useState, type FormEvent } from "react";
import {
  getButtondownReferUrl,
  getNewsletterSubscribeMode,
  isValidNewsletterEmail,
} from "@/lib/newsletter";

type Status = "idle" | "opened" | "error";

type Props = {
  formIdSuffix?: string;
  className?: string;
  variant?: "default" | "compact" | "footer";
};

export function NewsletterSignup({
  formIdSuffix = "default",
  className = "",
  variant = "default",
}: Props) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const fieldId = `bd-email-${formIdSuffix}-${safeId}`;
  const descId = `newsletter-desc-${formIdSuffix}-${safeId}`;

  const mode = getNewsletterSubscribeMode();
  const referUrl = getButtondownReferUrl();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  /**
   * Buttondown risponde con una pagina Turnstile (anti-bot). In un iframe nascosto
   * il widget fallisce spesso (es. messaggi tipo blocked:origin in console).
   * target="_blank" apre la verifica in una scheda dedicata.
   */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (mode.kind !== "form_post") {
      e.preventDefault();
      return;
    }
    if (!isValidNewsletterEmail(email)) {
      e.preventDefault();
      setStatus("error");
      return;
    }
    setStatus("opened");
  };

  const isCompact = variant === "compact";
  const isFooter = variant === "footer";

  const shellClass = [
    isCompact
      ? "mt-10 border-t border-black/8 pt-5"
      : isFooter
        ? ""
        : "rounded-xl border border-black/8 bg-black/[0.02] px-3 py-3 sm:px-4 sm:py-4",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputClass =
    "h-10 w-full rounded-full border border-black/10 bg-white/90 px-4 text-sm text-charcoal shadow-none outline-none transition placeholder:text-black/35 focus:border-accent/40 focus:ring-2 focus:ring-accent/20";

  const submitClass =
    "h-10 shrink-0 cursor-pointer rounded-full border-0 bg-accent px-5 text-sm font-medium text-white shadow-none transition hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <section
      className={shellClass}
      aria-label="Iscrizione newsletter avvisi sbobinature"
    >
      {mode.kind === "form_post" ? (
        <form
          method="post"
          action={mode.actionUrl}
          target="_blank"
          onSubmit={onSubmit}
          noValidate
          className="embeddable-buttondown-form min-w-0 w-full max-w-full space-y-2"
        >
            <input type="hidden" name="tag" value={mode.tag} />
            <p id={descId} className="sr-only">
              Ricevi un avviso quando esce una nuova sbobinatura. Puoi
              disiscriverti dal link nelle email.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={fieldId}
                  className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/45"
                >
                  Newsletter Sbobinature
                </label>
                <input
                  type="email"
                  name="email"
                  id={fieldId}
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nome@esempio.it"
                  aria-describedby={descId}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                    if (status === "opened") setStatus("idle");
                  }}
                  className={inputClass}
                />
              </div>
              <button type="submit" className={submitClass}>
                Iscrivimi
              </button>
            </div>

            {referUrl ? (
              <p className="mb-0 font-mono text-[10px] leading-snug text-black/40">
                <a
                  href={referUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/50 underline decoration-black/15 underline-offset-[3px] transition hover:text-accent hover:decoration-accent/50"
                >
                  Powered by Buttondown
                </a>
              </p>
            ) : null}
          </form>
        ) : (
          <p className="text-sm text-black/40">
            <span className="sr-only">
              Newsletter non configurata. Imposta
              NEXT_PUBLIC_BUTTONDOWN_USERNAME o
              NEXT_PUBLIC_NEWSLETTER_FORM_ACTION nel build.
            </span>
            <span aria-hidden>—</span>
          </p>
        )}

      {mode.kind === "form_post" && status === "opened" ? (
        <p className="mt-2 text-sm text-accent" role="status">
          Si è aperta una nuova scheda: completa la verifica anti-spam e conferma
          l&apos;iscrizione. Controlla anche la posta in arrivo.
        </p>
      ) : null}
      {mode.kind === "form_post" && status === "error" ? (
        <p className="mt-2 text-sm text-red-700/90" role="alert">
          Inserisci un indirizzo email valido.
        </p>
      ) : null}
    </section>
  );
}
