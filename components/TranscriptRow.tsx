"use client";

import Link from "next/link";
import {
  useCommandQuery,
  useMatchQuery,
} from "@/components/CommandQueryContext";

type Props = {
  slug: string;
  speaker: string;
  topic: string;
  searchText: string;
  isNew: boolean;
  youtube: string | null;
  spotify: string | null;
};

export function TranscriptRow({
  slug,
  speaker,
  topic,
  searchText,
  isNew,
  youtube,
  spotify,
}: Props) {
  const match = useMatchQuery();
  const { setUnrolled } = useCommandQuery();
  const visible = match(searchText);
  if (!visible) return null;
  return (
    <li id={`transcript-${slug}`} className="scroll-mt-28">
      <Link
        href={`/?b=${encodeURIComponent(slug)}`}
        scroll={true}
        onClick={() => setUnrolled(true)}
        className="group block w-full text-left"
      >
        <p className="font-mono text-sm text-black/50">
          <span className="text-charcoal group-hover:text-accent group-hover:underline group-hover:decoration-accent/40">
            {speaker}
          </span>{" "}
          {isNew && (
            <span className="mr-1 inline-flex translate-y-[-1px] rounded-full border border-accent/20 bg-accent/5 px-1.5 py-px align-middle text-[9px] uppercase tracking-[0.12em] text-accent/75">
              new
            </span>
          )}
          <span className="text-black/30">—</span> {topic}
        </p>
        <span className="mt-0.5 block text-[10px] font-mono text-black/30 transition group-hover:text-accent/80">
          Apri la scheda con la sbobinatura completa
        </span>
      </Link>
      {(youtube || spotify) && (
        <p className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-black/45">
          {youtube && (
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition hover:underline"
              aria-label="Apri il video su YouTube"
              onClick={(e) => e.stopPropagation()}
            >
              YouTube
            </a>
          )}
          {youtube && spotify && (
            <span className="text-black/20" aria-hidden>
              ·
            </span>
          )}
          {spotify && (
            <a
              href={spotify}
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
    </li>
  );
}
