import { HumanCommandLine } from "@/components/HumanCommandLine";
import { getAllTranscriptItems } from "@/lib/get-transcripts";

export default function Home() {
  const transcriptItems = getAllTranscriptItems();
  return <HumanCommandLine transcriptItems={transcriptItems} />;
}
