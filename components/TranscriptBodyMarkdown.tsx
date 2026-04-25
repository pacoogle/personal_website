"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { source: string };

export function TranscriptBodyMarkdown({ source }: Props) {
  return (
    <div className="prose prose-neutral prose-sm max-w-none text-black/80 prose-p:leading-relaxed prose-a:text-accent">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  );
}
