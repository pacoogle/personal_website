import type { Metadata } from "next";
import { TranscriptArchive } from "@/components/TranscriptArchive";
import { getAllTranscriptItems } from "@/lib/get-transcripts";

export const metadata: Metadata = {
  title: "Sbobinature | Pasquale Ragozzino",
  description:
    "Archivio di sbobinature: conversazioni su tecnologia, impresa, AI e prodotto trasformate in testi leggibili e riusabili.",
};

export default function SbobinaturePage() {
  const items = getAllTranscriptItems();
  return <TranscriptArchive items={items} />;
}
