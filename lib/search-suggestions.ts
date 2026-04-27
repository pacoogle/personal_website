import { executive, humanSearchText, work } from "@/lib/cv";
import type { TranscriptItem } from "@/lib/get-transcripts";

/** Token split: spazi, virgole, e simili (come nel joinSearch del CV) */
const TOKEN_SPLIT = /[^a-z0-9#+./àèéìòù]+/i;

function tokenize(hay: string): string[] {
  return hay
    .toLowerCase()
    .split(TOKEN_SPLIT)
    .map((t) => t.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, ""))
    .filter((t) => t.length >= 2);
}

/**
 * Insieme unico di “parole” indicizzate da tutti i testi di ricerca del sito.
 * Usato per proporre termini collegati alla query quando non c’è match.
 */
export function getCorpusTokens(transcriptItems: TranscriptItem[]): string[] {
  const set = new Set<string>();
  const add = (s: string) => {
    for (const t of tokenize(s)) set.add(t);
  };
  add(executive.searchText);
  add(humanSearchText);
  for (const w of work) {
    add(w.searchText);
    add(`${w.company} ${w.role}`.toLowerCase());
  }
  for (const tr of transcriptItems) add(tr.searchText);
  return Array.from(set);
}

const FALLBACK_SUGGESTIONS = [
  "sintesi",
  "gamindo",
  "typescript",
  "docker",
  "sbobinature",
  "valori",
  "impatto",
  "biblioteca",
] as const;

/**
 * Quando nessuna sezione matcha, propone termini del corpus che “toccano”
 * la stringa attiva (prefix / substring) più alcuni default se serve.
 */
export function noResultSuggestions(
  query: string,
  corpusTokens: string[],
  max = 10
): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: { term: string; score: number }[] = [];
  for (const t of corpusTokens) {
    if (t === q) continue;
    let score = 0;
    if (t.startsWith(q)) {
      score = 200 - Math.min(50, t.length);
    } else if (q.length >= 3 && t.includes(q)) {
      score = 100 - Math.min(40, t.length);
    } else if (t.length >= 3 && q.length >= 3 && q.includes(t)) {
      score = 50 - t.length;
    }
    if (score > 0) scored.push({ term: t, score });
  }
  scored.sort(
    (a, b) => b.score - a.score || a.term.length - b.term.length
  );
  const seen = new Set<string>();
  const out: string[] = [];
  for (const { term } of scored) {
    if (seen.has(term)) continue;
    seen.add(term);
    out.push(term);
    if (out.length >= max) return out;
  }
  for (const f of FALLBACK_SUGGESTIONS) {
    if (out.length >= max) break;
    if (f === q) continue;
    if (seen.has(f)) continue;
    seen.add(f);
    out.push(f);
  }
  return out.slice(0, max);
}

export const SEARCH_HINT_ID = "home-search-hint";
