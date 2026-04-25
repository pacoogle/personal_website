import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type TranscriptItem = {
  slug: string;
  speaker: string;
  topic: string;
  body: string;
  searchText: string;
  /** URL video su YouTube (se presente) */
  youtube: string | null;
  /** URL episodio o clip su Spotify (se presente) */
  spotify: string | null;
};

const TRANSCRIPTS_DIR = path.join(process.cwd(), "content/transcripts");

export function getAllTranscriptItems(): TranscriptItem[] {
  if (!fs.existsSync(TRANSCRIPTS_DIR)) return [];

  return fs
    .readdirSync(TRANSCRIPTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const full = path.join(TRANSCRIPTS_DIR, file);
      const src = fs.readFileSync(full, "utf8");
      const { data, content } = matter(src);
      const speaker = String(data.speaker ?? "Sconosciuto");
      const topic = String(data.topic ?? "Tema");
      const slug = file.replace(/\.mdx?$/, "");
      const youtube =
        data.youtube != null && String(data.youtube).trim() !== ""
          ? String(data.youtube).trim()
          : null;
      const spotify =
        data.spotify != null && String(data.spotify).trim() !== ""
          ? String(data.spotify).trim()
          : null;
      const searchText = [speaker, topic, content, slug, youtube, spotify]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .concat(
          " biblioteca sbobinature trascritti transcript library sbobinatura youtube spotify video podcast comunità community gratuito ai agente highlight"
        );
      return {
        slug,
        speaker,
        topic,
        body: content.trim(),
        searchText,
        youtube,
        spotify,
      };
    });
}
