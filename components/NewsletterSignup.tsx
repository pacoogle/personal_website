"use client";

import { useCallback, useId, useRef, useState, type FormEvent } from "react";
import {
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
  const fieldId = `newsletter-email-${formIdSuffix}-${safeId}`;
  const iframeName = `newsletter-frame-${formIdSuffix}-${safeId}`;
  const descId = `newsletter-desc-${formIdSuffix}-${safeId}`;

  const mode = getNewsletterSubscribeMode();

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

  const rowClass = [
    "relative flex flex-wrap items-center gap-x-2 gap-y-1 sm:flex-nowrap sm:gap-x-3",
    isCompact
      ? "mt-10 border-t border-black/8 pt-5"
      : isFooter
        ? ""
        : "rounded-lg border border-black/8 bg-black/[0.02] px-2.5 py-1.5 sm:px-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const buttonClass =
    "inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-accent px-4 text-xs font-medium text-white transition hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 sm:px-5 sm:text-sm";

  return (
    <section
      className={rowClass}
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
      <h3
        id={`newsletter-heading-${formIdSuffix}`}
        className="shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 sm:text-[11px]"
      >
        Newsletter
        <span className="sr-only"> sbobinature</span>
      </h3>
      <p id={descId} className="sr-only">
        Ricevi un avviso quando esce una nuova sbobinatura. Niente spam, solo
        quel filone. Puoi disiscriverti dal link nelle email.
        {mode.kind === "buttondown_page"
          ? " Il pulsante Iscriviti apre la pagina sicura di Buttondown in una nuova scheda; lì inserisci la email."
          : null}
      </p>

      {mode.kind === "form_post" ? (
        <form
          className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap"
          method="post"
          action={mode.actionUrl}
          target={iframeName}
          onSubmit={onSubmit}
          noValidate
        >
          <input type="hidden" name="tag" value={mode.tag} />
          <label htmlFor={fieldId} className="sr-only">
            Email per la newsletter
          </label>
          <input
            id={fieldId}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="Email"
            aria-describedby={descId}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
              if (status === "success") setStatus("idle");
            }}
            disabled={status === "loading"}
            className="h-9 min-w-[6rem] flex-1 rounded-full border border-black/10 bg-white/80 px-3 text-sm text-charcoal outline-none ring-0 placeholder:text-black/35 focus:border-accent/40 focus:ring-2 focus:ring-accent/20 sm:min-w-[10rem]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`${buttonClass} disabled:opacity-60`}
          >
            {status === "loading" ? "…" : "Iscrivimi"}
          </button>
        </form>
      ) : null}

      {mode.kind === "buttondown_page" ? (
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap">
          <a
            href={mode.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
            aria-describedby={descId}
          >
            Iscriviti
          </a>
        </div>
      ) : null}

      {mode.kind === "none" ? (
        <span className="sr-only">
          Newsletter non configurata: imposta NEXT_PUBLIC_BUTTONDOWN_USERNAME o
          NEXT_PUBLIC_NEWSLETTER_FORM_ACTION nel build.
        </span>
      ) : null}

      {mode.kind === "form_post" && status === "success" ? (
        <span className="shrink-0 text-xs text-accent" role="status">
          Controlla la posta.
        </span>
      ) : null}
      {mode.kind === "form_post" && status === "error" ? (
        <span className="shrink-0 text-xs text-red-700/90" role="alert">
          Email non valida.
        </span>
      ) : null}
    </section>
  );
}
