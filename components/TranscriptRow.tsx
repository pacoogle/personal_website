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
  const anchorId = `sbobinatura-${slug}`;
  const detailHref = `/sbobinature/${slug}`;
  if (!visible) return null;
  return (
    <li id={anchorId} className="scroll-mt-28">
      <Link
        href={detailHref}
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
          Apri la pagina dedicata con la sbobinatura completa
        </span>
      </Link>
      {(youtube || spotify) && (
        <p className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-black/45">
          {youtube && (
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent transition hover:underline"
              aria-label="Apri il video su YouTube"
              onClick={(e) => e.stopPropagation()}
            >
              <IconYouTube />
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

function IconYouTube() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0"
      fill="currentColor"
    >
      <path d="M21.58 7.19a2.48 2.48 0 0 0-1.75-1.75C18.28 5.02 12 5.02 12 5.02s-6.28 0-7.83.42a2.48 2.48 0 0 0-1.75 1.75A25.88 25.88 0 0 0 2 12a25.88 25.88 0 0 0 .42 4.81 2.48 2.48 0 0 0 1.75 1.75c1.55.42 7.83.42 7.83.42s6.28 0 7.83-.42a2.48 2.48 0 0 0 1.75-1.75A25.88 25.88 0 0 0 22 12a25.88 25.88 0 0 0-.42-4.81ZM10 14.98V9.02L15.2 12 10 14.98Z" />
    </svg>
  );
}
