"use client";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { SbobinaturaDetailView } from "@/components/SbobinaturaDetailView";
import { TranscriptRow } from "@/components/TranscriptRow";
import {
  CommandQueryProvider,
  useCommandQuery,
} from "@/components/CommandQueryContext";
import type { WorkBlock } from "@/lib/cv";
import {
  executive,
  humanSearchText,
  systemConstants,
  visibleWhenQuery,
  work,
} from "@/lib/cv";
import type { TranscriptItem } from "@/lib/get-transcripts";

const PUBLIC_BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function publicPath(href: string) {
  const p = href.startsWith("/") ? href : `/${href}`;
  return `${PUBLIC_BASE}${p}`;
}

const PLACEHOLDER =
  "Chiedimi quello che vuoi, riguardo a me o al mio lavoro o alla mia vita...";

const devSudoMessage =
  "Modello di permessi: fiducia. Hai trovato il percorso per sviluppatori — costruisco in trasparenza: contratti chiari, code review umane, sistemi comprensibili senza “root”. — P.";

type ShellProps = {
  transcriptItems: TranscriptItem[];
};

export function HumanCommandLine({ transcriptItems }: ShellProps) {
  return (
    <CommandQueryProvider>
      <Suspense
        fallback={<div className="min-h-screen bg-white" aria-hidden />}
      >
        <HumanCommandLineView transcriptItems={transcriptItems} />
      </Suspense>
    </CommandQueryProvider>
  );
}

function HumanCommandLineView({ transcriptItems }: ShellProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const bParam = searchParams.get("b");
  const detail = useMemo(
    () =>
      bParam
        ? transcriptItems.find((t) => t.slug === bParam)
        : undefined,
    [bParam, transcriptItems]
  );
  const isValidDetail = Boolean(bParam && detail);
  const isInvalidDetail = Boolean(bParam && !detail);

  const transcriptSearchTexts = useMemo(
    () => transcriptItems.map((t) => t.searchText),
    [transcriptItems]
  );

  const { query, setQuery, unrolled, setUnrolled } = useCommandQuery();
  const firstScrollDone = useRef(false);
  const reduceMotion = useReducedMotion();

  const q = query.trim().toLowerCase();
  const sudoActive = q.includes("sudo");

  const match = useCallback(
    (hay: string) => visibleWhenQuery(query, hay),
    [query]
  );

  const execVisible = match(executive.searchText);
  const anyWorkVisible = work.some((w) => match(w.searchText));
  const anyTranscriptVisible = transcriptSearchTexts.some((s) => match(s));
  const humanVisible = match(humanSearchText);

  const sectionIds = useMemo(() => {
    const ids: string[] = [];
    if (execVisible) ids.push("executive");
    work.forEach((w) => {
      if (match(w.searchText)) ids.push(`job-${w.id}`);
    });
    if (humanVisible) ids.push("human");
    if (anyTranscriptVisible) ids.push("library");
    return ids;
  }, [execVisible, anyTranscriptVisible, humanVisible, match]);

  useEffect(() => {
    if (bParam) {
      setUnrolled(true);
    }
  }, [bParam, setUnrolled]);

  useEffect(() => {
    if (isValidDetail) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isValidDetail, bParam]);

  useEffect(() => {
    if (bParam) {
      return;
    }
    if (!unrolled || !q) {
      firstScrollDone.current = false;
      return;
    }
    const first = sectionIds[0];
    if (!first) return;
    const el = document.getElementById(first);
    if (el && !firstScrollDone.current) {
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      firstScrollDone.current = true;
    }
  }, [bParam, q, unrolled, sectionIds, reduceMotion]);

  useEffect(() => {
    firstScrollDone.current = false;
  }, [q]);

  const listStagger = reduceMotion ? 0 : 0.06;
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: listStagger, delayChildren: 0.05 },
    },
  };

  const workRowStagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: listStagger, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 380, damping: 32 },
    },
  };

  const clearUrlDetail = useCallback(() => {
    if (bParam) {
      router.replace(pathname || "/");
    }
  }, [bParam, router, pathname]);

  const collapse = useCallback(() => {
    clearUrlDetail();
    setUnrolled(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [clearUrlDetail, setUnrolled]);

  const handleBackFromSbobinatura = useCallback(() => {
    router.replace(pathname || "/");
    setUnrolled(true);
    setQuery("biblioteca");
    setTimeout(() => {
      requestAnimationFrame(() => {
        document.getElementById("library")?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }, 80);
  }, [router, pathname, setUnrolled, setQuery, reduceMotion]);

  useEffect(() => {
    if (!unrolled) return;
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (isValidDetail) {
          handleBackFromSbobinatura();
        } else {
          collapse();
        }
      }
    };
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, [unrolled, collapse, isValidDetail, handleBackFromSbobinatura]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setUnrolled(true);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (isValidDetail) {
        handleBackFromSbobinatura();
      } else {
        collapse();
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (bParam) {
      router.replace(pathname || "/");
    }
    setQuery(e.target.value);
    setUnrolled(true);
  };

  const hasLibrary = transcriptItems.length > 0;

  const goToSection = useCallback(
    (id: "executive" | "work" | "library" | "human") => {
      if (bParam) {
        router.replace(pathname || "/");
      }
      setUnrolled(true);
      if (id === "library") {
        setQuery("biblioteca");
      } else {
        setQuery("");
      }
      const runScroll = () => {
        document.getElementById(id)?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      };
      setTimeout(runScroll, 0);
      setTimeout(runScroll, 80);
    },
    [bParam, router, pathname, setUnrolled, setQuery, reduceMotion]
  );

  const noResults =
    unrolled &&
    q.length > 0 &&
    !sudoActive &&
    !execVisible &&
    !anyWorkVisible &&
    !anyTranscriptVisible &&
    !humanVisible;

  return (
    <div className="min-h-screen bg-white text-charcoal">
      <div
        className={
          unrolled
            ? "sticky top-0 z-30 border-b border-transparent bg-white/90 px-5 py-6 backdrop-blur-md"
            : "flex min-h-screen flex-col items-center justify-center px-5"
        }
      >
        <div className="mx-auto w-full max-w-2xl">
          {!unrolled && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10 flex flex-col items-center"
            >
              <div className="mb-5 flex justify-center">
                <Image
                  src={publicPath("/avatar.png")}
                  alt="Pasquale Ragozzino"
                  width={128}
                  height={128}
                  className="h-28 w-28 rounded-full border-2 border-white object-cover shadow-md ring-2 ring-black/[0.08] md:h-32 md:w-32"
                  priority
                  sizes="128px"
                />
              </div>
              <h1 className="text-center font-display text-3xl font-bold tracking-[-0.02em] text-charcoal antialiased md:text-4xl lg:text-5xl">
                Pasquale Ragozzino
              </h1>
            </motion.div>
          )}
          <label className="sr-only" htmlFor="command-input">
            Riga di comando
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              id="command-input"
              type="search"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder={PLACEHOLDER}
              className="min-w-0 flex-1 rounded-full border-0 bg-black/[0.04] px-6 py-4 text-base text-charcoal shadow-none outline-none ring-0 transition placeholder:text-black/35 focus:bg-black/[0.06] focus:ring-2 focus:ring-accent/30 md:text-lg"
              autoFocus
            />
            {unrolled && (
              <button
                type="button"
                onClick={collapse}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-2xl leading-none text-black/50 transition hover:bg-black/[0.1] hover:text-black/80 focus:outline-none focus:ring-2 focus:ring-accent/40 sm:h-14 sm:w-14"
                aria-label="Richiudi e torna alla vista iniziale"
                title="Richiudi (Esc)"
              >
                <span aria-hidden className="-mt-0.5 select-none">
                  ×
                </span>
              </button>
            )}
          </div>
          <p
            className={
              (unrolled ? "mt-2 " : "mt-3 ") +
              "text-center font-mono text-[11px] text-black/40"
            }
          >
            {unrolled
              ? "Esc o X: torna al titolo e nascondi i contenuti."
              : "Premi Invio per esplorare tutto."}
          </p>
          {unrolled && (
            <nav
              className="mt-3 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 font-mono text-[11px] text-black/45 sm:gap-x-2"
              aria-label="Vai a sezione"
            >
              <span className="text-black/30 sm:inline">Vai a:</span>
              <NavPill
                onClick={() => goToSection("executive")}
                label="Sintesi"
              />
              <span className="text-black/20" aria-hidden>
                ·
              </span>
              <NavPill onClick={() => goToSection("work")} label="Lavoro" />
              <span className="text-black/20" aria-hidden>
                ·
              </span>
              <NavPill onClick={() => goToSection("human")} label="Valori" />
              {hasLibrary && (
                <>
                  <span className="text-black/20" aria-hidden>
                    ·
                  </span>
                  <NavPill
                    onClick={() => goToSection("library")}
                    label="Sbobinature"
                    highlight
                  />
                </>
              )}
            </nav>
          )}
          {!unrolled && hasLibrary && (
            <p className="mt-5 text-center">
              <button
                type="button"
                onClick={() => goToSection("library")}
                className="font-mono text-[12px] text-accent/90 underline decoration-accent/30 underline-offset-4 transition hover:text-accent hover:decoration-accent/60"
              >
                La biblioteca · Sbobinature
              </button>
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {unrolled && isValidDetail && detail && (
          <div key="sbobina-open" className="pt-2">
            <SbobinaturaDetailView
              item={detail}
              onBack={handleBackFromSbobinatura}
              reduceMotion={reduceMotion}
            />
          </div>
        )}

        {unrolled && isInvalidDetail && (
          <div
            key="sbobina-404"
            className="mx-auto max-w-2xl scroll-mt-28 px-5 pb-32 pt-8 text-center"
          >
            <p className="mb-4 font-mono text-sm text-black/50">
              Nessuna sbobinatura con questo indirizzo.
            </p>
            <button
              type="button"
              onClick={() => {
                router.replace(pathname || "/");
                setUnrolled(true);
              }}
              className="text-sm text-accent hover:underline"
            >
              Torna alla home
            </button>
          </div>
        )}

        {unrolled && bParam == null && (
          <motion.div
            key="content"
            className="pt-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          >
            <motion.main
              className="mx-auto max-w-2xl px-5"
              variants={itemVariants}
            >
            {sudoActive && (
              <motion.aside
                variants={itemVariants}
                className="mb-12 rounded-2xl bg-black/[0.03] p-5 font-mono text-[13px] leading-relaxed text-charcoal/90"
                role="status"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                  sudo: avviso per sviluppatori
                </p>
                <p className="mt-2">{devSudoMessage}</p>
              </motion.aside>
            )}

            {noResults && (
              <motion.p
                variants={itemVariants}
                className="mb-8 font-mono text-sm text-black/50"
              >
                Nessun risultato per «{query.trim()}». Prova un’azienda, uno
                stack o un valore.
              </motion.p>
            )}

            {execVisible && (
              <motion.section
                id="executive"
                variants={itemVariants}
                className="mb-20 scroll-mt-28"
              >
                <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                  {executive.title}
                </h2>
                <p className="text-2xl font-semibold leading-snug tracking-tight text-charcoal md:text-3xl">
                  {executive.headline}
                </p>
                <p className="mt-5 text-base leading-relaxed text-black/70">
                  {executive.subline}
                </p>
              </motion.section>
            )}

            {anyWorkVisible && (
              <motion.section
                id="work"
                variants={itemVariants}
                className="mb-20 scroll-mt-28"
              >
                <h2 className="mb-10 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                  Moduli professionali
                </h2>
                <motion.div
                  className="flex flex-col gap-16"
                  variants={workRowStagger}
                >
                  {work.map((w) => (
                    <WorkCard
                      key={w.id}
                      block={w}
                      visible={match(w.searchText)}
                      variants={itemVariants}
                    />
                  ))}
                </motion.div>
              </motion.section>
            )}

            {humanVisible && (
              <motion.section
                id="human"
                variants={itemVariants}
                className="mb-20 scroll-mt-28"
              >
                <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                  Le mie costanti
                </h2>
                <p className="mb-8 text-sm text-black/50">
                  Costanti di sistema — ciò che resta vero tra un progetto e
                  l’altro.
                </p>
                <dl className="space-y-6 font-mono text-[13px]">
                  {systemConstants.map((row) => (
                    <div key={row.key}>
                      <div className="flex flex-wrap items-baseline gap-2 text-charcoal">
                        <dt className="text-accent">{row.key}</dt>
                        <dd className="text-black/80">= {row.value}</dd>
                      </div>
                      {row.note && (
                        <p className="mt-0.5 pl-0 font-sans text-[12px] text-black/45">
                          {row.note}
                        </p>
                      )}
                    </div>
                  ))}
                </dl>
              </motion.section>
            )}
            </motion.main>

            {anyTranscriptVisible && (
              <motion.section
                id="library"
                aria-labelledby="library-heading"
                variants={itemVariants}
                className="scroll-mt-24 border-t border-black/8 bg-gradient-to-b from-black/[0.02] to-black/[0.04] py-20"
              >
                <div className="mx-auto max-w-2xl px-5">
                  <h2
                    id="library-heading"
                    className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40"
                  >
                    La biblioteca · Sbobinature
                  </h2>
                  <p className="mb-3 max-w-prose text-sm leading-relaxed text-black/60">
                    Questo spazio raccoglie ciò che «sbobino» per rimetterlo alla
                    community <strong className="font-medium text-charcoal">in
                    modo gratuito</strong>: ogni scheda parte da un video{" "}
                    <strong className="font-medium text-charcoal">YouTube</strong>{" "}
                    o un episodio{" "}
                    <strong className="font-medium text-charcoal">Spotify</strong>
                    , poi con un <strong className="font-medium text-charcoal">
                    agente AI</strong> lavoro trascrizioni, testo pulito, highlight
                    e note — per restituire in chiaro e riusabile le sessioni che
                    seguo.
                  </p>
                  <p className="mb-10 max-w-prose text-sm text-black/50">
                    <strong className="font-medium text-black/60">Clicca</strong>{" "}
                    su un titolo per aprire la <strong className="font-medium text-black/60">scheda
                    con la sbobinatura intera</strong> (mantiene la searchbar in
                    alto). Sotto ogni riga, link diretti a YouTube o Spotify. Dalla
                    barra, <span className="text-black/60">Vai a → Sbobinature</span> o
                    cerca <span className="font-mono text-black/55">biblioteca
                    </span> / <span className="font-mono text-black/55">sbobinature</span>.
                  </p>
                  <ul className="flex flex-col gap-10">
                    {transcriptItems.map((t) => (
                      <TranscriptRow
                        key={t.slug}
                        slug={t.slug}
                        speaker={t.speaker}
                        topic={t.topic}
                        searchText={t.searchText}
                        youtube={t.youtube}
                        spotify={t.spotify}
                      />
                    ))}
                  </ul>
                </div>
              </motion.section>
            )}

            <motion.footer
              className="mx-auto max-w-2xl border-t border-black/6 px-5 pt-4 pb-6"
              variants={itemVariants}
            >
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <a
                  href={publicPath("/CV_PasqualeRagozzino_en.pdf")}
                  download
                  className="inline-flex w-fit shrink-0 text-sm font-medium text-accent underline-offset-4 transition hover:underline"
                >
                  Scarica il mio CV in PDF
                </a>
                <nav
                  className="flex min-w-0 flex-col gap-0.5 text-sm sm:max-w-[min(100%,20rem)] sm:items-end sm:text-right"
                  aria-label="Contatti"
                >
                  <a
                    href="mailto:pasquale.ragozzino89@gmail.com"
                    className="group grid w-full max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-1.5 text-black/65 transition hover:text-accent sm:ml-auto sm:w-[min(100%,20rem)]"
                  >
                    <span className="min-w-0 break-all sm:text-right">
                      pasquale.ragozzino89@gmail.com
                    </span>
                    <span className="inline-flex size-3.5 shrink-0 self-center text-black/40 transition group-hover:text-accent">
                      <IconMail />
                    </span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/pasqualeragozzino/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-fit items-center justify-end gap-1.5 sm:ml-auto text-black/65 transition hover:text-accent"
                  >
                    <span>LinkedIn</span>
                    <span className="inline-flex size-3.5 shrink-0 text-[#0A66C2] opacity-80 transition group-hover:opacity-100">
                      <IconLinkedIn />
                    </span>
                  </a>
                  <a
                    href="https://github.com/pacoogle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-fit items-center justify-end gap-1.5 sm:ml-auto text-black/65 transition hover:text-accent"
                  >
                    <span>GitHub</span>
                    <span className="inline-flex size-3.5 shrink-0 text-charcoal/70 transition group-hover:text-charcoal">
                      <IconGitHub />
                    </span>
                  </a>
                </nav>
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavPill({
  label,
  onClick,
  highlight,
}: {
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "whitespace-nowrap rounded-full px-2 py-0.5 transition " +
        (highlight
          ? "text-accent hover:bg-accent/10"
          : "hover:bg-black/[0.04] hover:text-black/80")
      }
    >
      {label}
    </button>
  );
}

function WorkCard({
  block,
  visible,
  variants,
}: {
  block: WorkBlock;
  visible: boolean;
  variants: Variants;
}) {
  if (!visible) return null;
  return (
    <motion.article
      id={`job-${block.id}`}
      variants={variants}
      className="scroll-mt-28"
    >
      <p className="text-xs text-black/40">
        {block.period} · {block.location}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">
        {block.role}
      </h3>
      <p className="text-sm font-medium text-black/55">{block.company}</p>
      <p className="mt-4 text-base leading-relaxed text-black/75">
        {block.body}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {block.tech.map((label) => (
          <span
            key={label}
            className="font-mono text-[10px] uppercase tracking-wider text-black/45"
          >
            {label}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function IconMail() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.86 8.16 6.84 9.5.5.1.66-.22.66-.48 0-.24-.01-.86-.01-1.7-2.78.6-3.36-1.33-3.36-1.33-.46-1.16-1.1-1.47-1.1-1.47-.9-.6.07-.6.07-.6.98.08 1.5 1.01 1.5 1.01.9 1.5 2.35 1.07 2.9.83.1-.64.35-1.08.64-1.32-2.22-.25-4.55-1.1-4.55-4.9 0-1.08.4-1.98 1.04-2.65-.1-.25-.45-1.3.1-2.7 0 0 .86-.28 2.8 1.01a9.4 9.4 0 0 1 2.5-.33c.85.01 1.7.11 2.5.33 1.95-1.3 2.8-1.01 2.8-1.01.55 1.4.2 2.45.1 2.7.64.68 1.04 1.57 1.04 2.65 0 3.8-2.35 4.64-4.6 4.9.35.3.7.9.7 1.8 0 1.3-.01 2.35-.01 2.68 0 .27.16.6.66.5A10.16 10.16 0 0 0 22 12c0-5.52-4.48-10-10-10z"
      />
    </svg>
  );
}
