"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Props = { source: string };

export function TranscriptBodyMarkdown({ source }: Props) {
  return (
    <div className="prose prose-neutral prose-sm max-w-none text-black/80 prose-p:leading-relaxed prose-a:text-accent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
