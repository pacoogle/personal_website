"use client";

import type { TranscriptItem } from "@/lib/get-transcripts";
import { TranscriptBodyMarkdown } from "@/components/TranscriptBodyMarkdown";
import { motion } from "framer-motion";

type Props = {
  item: TranscriptItem;
  onBack: () => void;
  reduceMotion: boolean | null;
};

export function SbobinaturaDetailView({
  item,
  onBack,
  reduceMotion,
}: Props) {
  return (
    <motion.article
      className="mx-auto max-w-2xl scroll-mt-28 px-5 pb-32 pt-4"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-8 font-mono text-[12px] text-accent/90 transition hover:underline"
      >
        ← Torna alla biblioteca
      </button>
      <header className="mb-8 border-b border-black/6 pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-black/40">
          Sbobinatura
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-charcoal md:text-3xl">
          <span className="text-black/70">{item.speaker}</span>
          <span className="text-black/30"> — </span>
          <span>{item.topic}</span>
        </h1>
        {(item.youtube || item.spotify) && (
          <p className="mt-4 flex flex-wrap items-center gap-3 text-[12px] font-mono text-black/45">
            {item.youtube && (
              <a
                href={item.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition hover:underline"
                aria-label="Apri il video su YouTube"
                onClick={(e) => e.stopPropagation()}
              >
                YouTube
              </a>
            )}
            {item.youtube && item.spotify && (
              <span className="text-black/20" aria-hidden>
                ·
              </span>
            )}
            {item.spotify && (
              <a
                href={item.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition hover:underline"
                aria-label="Apri l’episodio su Spotify"
                onClick={(e) => e.stopPropagation()}
              >
                Spotify
              </a>
            )}
          </p>
        )}
      </header>
      <TranscriptBodyMarkdown source={item.body} />
    </motion.article>
  );
}
