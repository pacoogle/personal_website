"use client";

import { useCallback, useId, useRef, useState, type FormEvent } from "react";
import {
  getButtondownReferUrl,
  getNewsletterSubscribeMode,
  isValidNewsletterEmail,
} from "@/lib/newsletter";

type Status = "idle" | "loading" | "success" | "error";

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
  const iframeName = `newsletter-frame-${formIdSuffix}-${safeId}`;
  const descId = `newsletter-desc-${formIdSuffix}-${safeId}`;

  const mode = getNewsletterSubscribeMode();
  const referUrl = getButtondownReferUrl();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const pendingSubmit = useRef(false);

  const onIframeLoad = useCallback(() => {
    if (!pendingSubmit.current) return;
    pendingSubmit.current = false;
    setStatus("success");
    setEmail("");
  }, []);

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
    pendingSubmit.current = true;
    setStatus("loading");
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
      aria-labelledby={`newsletter-heading-${formIdSuffix}`}
    >
      {mode.kind === "form_post" ? (
        <iframe
          name={iframeName}
          title="Conferma iscrizione newsletter"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          aria-hidden
          onLoad={onIframeLoad}
        />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <h3
          id={`newsletter-heading-${formIdSuffix}`}
          className="shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 sm:mt-2.5 sm:text-[11px]"
        >
          Newsletter
          <span className="sr-only"> sbobinature</span>
        </h3>

        {mode.kind === "form_post" ? (
          <form
            method="post"
            action={mode.actionUrl}
            target={iframeName}
            onSubmit={onSubmit}
            noValidate
            className="embeddable-buttondown-form min-w-0 flex-1 space-y-2"
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
                  La tua email
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
                    if (status === "success") setStatus("idle");
                  }}
                  disabled={status === "loading"}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className={submitClass}
              >
                {status === "loading" ? "Invio…" : "Iscrivimi"}
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
      </div>

      {mode.kind === "form_post" && status === "success" ? (
        <p className="mt-2 text-sm text-accent" role="status">
          Richiesta inviata. Controlla la posta per confermare l&apos;iscrizione,
          se richiesto.
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
