import Link from "next/link";
import type { TranscriptItem } from "@/lib/get-transcripts";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { TranscriptBodyMarkdown } from "@/components/TranscriptBodyMarkdown";
import { TranscriptPreviewPoster } from "@/components/TranscriptPreviewPoster";

type Props = {
  item: TranscriptItem;
};

export function TranscriptReader({ item }: Props) {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-charcoal">
      <article>
        <header className="border-b border-black/10 bg-white">
          <div className="mx-auto max-w-5xl px-5 pb-10 pt-7 md:px-8 md:pb-14">
            <nav
              aria-label="Navigazione sbobinature"
              className="flex flex-wrap items-center gap-2 font-mono text-[12px] text-black/45"
            >
              <Link href="/" className="transition hover:text-accent">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link
                href="/sbobinature"
                className="transition hover:text-accent"
              >
                Sbobinature
              </Link>
            </nav>

            <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_17rem] md:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  Sbobinatura completa
                </p>
                <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.04] tracking-tight md:text-5xl">
                  <span className="text-black/70">{item.speaker}</span>
                  <span className="text-black/30"> - </span>
                  {item.topic}
                </h1>
                {item.summary && (
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-black/65">
                    {item.summary}
                  </p>
                )}
              </div>

              <aside className="rounded-lg border border-black/10 bg-[#f4efe6] p-5">
                <dl className="grid grid-cols-2 gap-4">
                  <Meta label="lettura" value={`${item.readingMinutes} min`} />
                  <Meta label="parole" value={formatNumber(item.wordCount)} />
                </dl>
                <div className="mt-5 flex flex-wrap gap-3 font-mono text-[12px]">
                  {item.youtube && (
                    <a
                      href={item.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      YouTube
                    </a>
                  )}
                  {item.spotify && (
                    <a
                      href={item.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Spotify
                    </a>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 pt-8 md:px-8">
          <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
            <TranscriptPreviewPoster item={item} size="hero" />
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 pt-8 md:grid-cols-[minmax(0,42rem)_16rem] md:px-8 md:pt-10">
          <div className="min-w-0 rounded-lg border border-black/10 bg-white px-5 py-7 shadow-sm md:px-8 md:py-9">
            <TranscriptBodyMarkdown source={item.body} />
          </div>

          <aside className="space-y-6 md:sticky md:top-8 md:self-start">
            {item.highlights.length > 0 && (
              <section className="rounded-lg border border-black/10 bg-white p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">
                  Temi
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="rounded-full border border-black/10 bg-[#fbfaf7] px-2.5 py-1 font-mono text-[10px] text-black/55"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-lg border border-black/10 bg-white p-5">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">
                Aggiornamenti
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/60">
                Un avviso quando esce una nuova sbobinatura, senza rumore.
              </p>
              <NewsletterSignup
                formIdSuffix={`reader-${item.slug}`}
                variant="compact"
                className="mt-4"
              />
            </section>

            <Link
              href="/sbobinature"
              className="inline-flex font-mono text-[12px] text-accent hover:underline"
            >
              Torna all&apos;archivio
            </Link>
          </aside>
        </div>
      </article>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
        {label}
      </dt>
      <dd className="mt-1 font-display text-xl font-semibold tracking-tight">
        {value}
      </dd>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("it-IT").format(value);
}
