import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TranscriptReader } from "@/components/TranscriptReader";
import {
  getAllTranscriptItems,
  getTranscriptBySlug,
} from "@/lib/get-transcripts";

type Params = {
  slug: string;
};

type PageProps = {
  params: Promise<Params>;
};

export function generateStaticParams() {
  return getAllTranscriptItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getTranscriptBySlug(slug);
  if (!item) {
    return {
      title: "Sbobinatura non trovata | Pasquale Ragozzino",
    };
  }

  return {
    title: `${item.speaker} - ${item.topic} | Sbobinature`,
    description:
      item.summary ||
      `Sbobinatura completa della conversazione con ${item.speaker}.`,
  };
}

export default async function SbobinaturaPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getTranscriptBySlug(slug);
  if (!item) notFound();

  return <TranscriptReader item={item} />;
}
