"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TranscriptItem } from "@/lib/get-transcripts";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { TranscriptPreviewPoster } from "@/components/TranscriptPreviewPoster";

type Props = {
  items: TranscriptItem[];
};

export function TranscriptArchive({ items }: Props) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const visibleItems = useMemo(() => {
    if (!normalizedQuery) return items;
    return items.filter((item) => item.searchText.includes(normalizedQuery));
  }, [items, normalizedQuery]);

  const totalWords = items.reduce((sum, item) => sum + item.wordCount, 0);
  const totalMinutes = items.reduce((sum, item) => sum + item.readingMinutes, 0);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-charcoal">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-12 pt-7 md:grid-cols-[minmax(0,1fr)_18rem] md:px-8 md:pb-16">
          <div>
            <Link
              href="/"
              className="font-mono text-[12px] text-black/45 transition hover:text-accent"
            >
              Pasquale Ragozzino
            </Link>
            <p className="mt-14 font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Archivio editoriale
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-charcoal md:text-6xl">
              Sbobinature di conversazioni che meritano una seconda vita.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/65">
              Video, podcast e incontri trasformati in testi leggibili,
              indicizzabili e riusabili. Uno spazio ordinato per ritrovare
              idee, passaggi chiave e connessioni tra tecnologia, impresa e AI.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10">
              <Stat label="sbobinature" value={items.length.toString()} />
              <Stat label="parole" value={formatCompact(totalWords)} />
              <Stat label="minuti" value={formatCompact(totalMinutes)} />
            </div>
          </div>
          <aside className="self-end rounded-lg border border-black/10 bg-[#f4efe6] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">
              Prossime uscite
            </p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">
              Ricevi un avviso quando pubblico una nuova sbobinatura. Poche
              email, solo quando c&apos;è qualcosa di davvero utile da leggere.
            </p>
            <NewsletterSignup
              formIdSuffix="transcripts-archive"
              variant="compact"
              className="mt-5"
            />
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Biblioteca delle sbobinature
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/55">
              Cerca per ospite, azienda, tema o parola chiave. Ogni scheda
              conserva i link alla fonte originale e una lettura pulita.
            </p>
          </div>
          <label className="w-full md:w-80">
            <span className="sr-only">Cerca nelle sbobinature</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca nome, tema, azienda..."
              className="h-12 w-full rounded-full border border-black/10 bg-white px-5 font-mono text-sm text-charcoal outline-none transition placeholder:text-black/35 focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
            />
          </label>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {visibleItems.map((item) => (
            <TranscriptCard key={item.slug} item={item} />
          ))}
        </div>

        {visibleItems.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-mono text-sm text-black/50">
              Nessuna sbobinatura contiene &quot;{query.trim()}&quot;.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-sm text-accent underline-offset-4 hover:underline"
            >
              Mostrale tutte
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function TranscriptCard({ item }: { item: TranscriptItem }) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md sm:grid-cols-[9.5rem_minmax(0,1fr)]">
      <Link
        href={`/sbobinature/${item.slug}`}
        className="group relative block h-48 overflow-hidden bg-black/[0.04] sm:h-auto sm:min-h-full"
        aria-label={`Apri la sbobinatura di ${item.speaker}`}
      >
        <TranscriptPreviewPoster item={item} />
      </Link>
      <div className="flex min-w-0 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-black/40">
          <span>{item.readingMinutes} min</span>
          {item.isNew && (
            <span className="rounded-full border border-accent/25 bg-accent/[0.06] px-2 py-0.5 text-accent">
              nuova
            </span>
          )}
        </div>
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-charcoal">
          <Link href={`/sbobinature/${item.slug}`} className="hover:text-accent">
            <span className="text-black/70">{item.speaker}</span>
            <span className="text-black/30"> - </span>
            {item.topic}
          </Link>
        </h3>
        {item.summary && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/60">
            {item.summary}
          </p>
        )}
        {item.highlights.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Temi">
            {item.highlights.slice(0, 4).map((highlight) => (
              <li
                key={highlight}
                className="rounded-full border border-black/10 bg-[#fbfaf7] px-2.5 py-1 font-mono text-[10px] text-black/55"
              >
                {highlight}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[11px] text-black/45">
          <Link
            href={`/sbobinature/${item.slug}`}
            className="text-accent hover:underline"
          >
            Apri sbobinatura
          </Link>
          {item.youtube && (
            <a
              href={item.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent hover:underline"
            >
              YouTube
            </a>
          )}
          {item.spotify && (
            <a
              href={item.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent hover:underline"
            >
              Spotify
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4 py-4">
      <p className="font-display text-2xl font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-black/40">
        {label}
      </p>
    </div>
  );
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("it-IT", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
