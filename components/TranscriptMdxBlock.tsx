import { MDXRemote } from "next-mdx-remote/rsc";

type Props = { source: string };

export function TranscriptMdxBlock({ source }: Props) {
  if (!source.trim()) return null;
  return (
    <div className="prose prose-neutral prose-sm mt-3 max-w-none text-black/80 prose-p:leading-relaxed">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            format: "mdx",
          },
        }}
      />
    </div>
  );
}
