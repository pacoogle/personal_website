import type { CSSProperties, ReactNode } from "react";
import type { TranscriptItem } from "@/lib/get-transcripts";

type Props = {
  item: TranscriptItem;
  size?: "card" | "hero";
};

type PosterTheme = {
  key: string;
  eyebrow: string;
  motif:
    | "agent"
    | "legal"
    | "travel"
    | "autonomy"
    | "growth"
    | "community"
    | "subscription"
    | "food"
    | "systems";
  bg: string;
  paper: string;
  ink: string;
  muted: string;
  accent: string;
};

const THEMES: PosterTheme[] = [
  {
    key: "agent",
    eyebrow: "AI agents",
    motif: "agent",
    bg: "#f4f6ff",
    paper: "#ffffff",
    ink: "#151a2d",
    muted: "#6e7487",
    accent: "#4f5fd7",
  },
  {
    key: "legal",
    eyebrow: "legal tech",
    motif: "legal",
    bg: "#f2f7f4",
    paper: "#ffffff",
    ink: "#14251e",
    muted: "#65756e",
    accent: "#25765a",
  },
  {
    key: "travel",
    eyebrow: "travel ops",
    motif: "travel",
    bg: "#f1f7fb",
    paper: "#ffffff",
    ink: "#142532",
    muted: "#647784",
    accent: "#2678a8",
  },
  {
    key: "autonomy",
    eyebrow: "autonomy",
    motif: "autonomy",
    bg: "#f3f6ef",
    paper: "#ffffff",
    ink: "#1e2619",
    muted: "#6f7868",
    accent: "#66853a",
  },
  {
    key: "growth",
    eyebrow: "growth",
    motif: "growth",
    bg: "#fff5ed",
    paper: "#ffffff",
    ink: "#2e1f17",
    muted: "#7d6a5f",
    accent: "#d96933",
  },
  {
    key: "community",
    eyebrow: "community",
    motif: "community",
    bg: "#f7f3ff",
    paper: "#ffffff",
    ink: "#261d35",
    muted: "#746a83",
    accent: "#7654c9",
  },
  {
    key: "subscription",
    eyebrow: "subscription",
    motif: "subscription",
    bg: "#f0f8f8",
    paper: "#ffffff",
    ink: "#142728",
    muted: "#647a7b",
    accent: "#278084",
  },
  {
    key: "food",
    eyebrow: "food and places",
    motif: "food",
    bg: "#faf3e8",
    paper: "#ffffff",
    ink: "#2d2318",
    muted: "#7b6c5a",
    accent: "#9a6a2f",
  },
  {
    key: "systems",
    eyebrow: "systems",
    motif: "systems",
    bg: "#f3f4f1",
    paper: "#ffffff",
    ink: "#1f2723",
    muted: "#6c746f",
    accent: "#56645f",
  },
];

export function TranscriptPreviewPoster({ item, size = "card" }: Props) {
  const theme = getPosterTheme(item);
  const style = {
    "--poster-bg": theme.bg,
    "--poster-paper": theme.paper,
    "--poster-ink": theme.ink,
    "--poster-muted": theme.muted,
    "--poster-accent": theme.accent,
  } as CSSProperties;

  return (
    <div
      className={
        "relative isolate h-full w-full overflow-hidden bg-[var(--poster-bg)] text-[var(--poster-ink)] " +
        (size === "hero" ? "aspect-[16/6]" : "")
      }
      style={style}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.92),rgba(255,255,255,0)_34%)]" />
      <div className="absolute inset-3 rounded-[7px] border border-black/[0.06] bg-[var(--poster-paper)]/68" />

      <div className="absolute inset-x-6 top-6 flex items-center justify-between gap-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--poster-muted)]">
          {theme.eyebrow}
        </span>
        <span className="font-mono text-[10px] text-[var(--poster-accent)]">
          {getInitials(item.speaker)}
        </span>
      </div>

      <div
        className={
          "absolute flex items-center justify-center " +
          (size === "hero"
            ? "bottom-10 right-10 top-16 w-[34%]"
            : "inset-x-7 bottom-8 top-14")
        }
      >
        <PosterMark motif={theme.motif} />
      </div>

      {size === "hero" && (
        <div className="absolute bottom-8 left-6 right-6 max-w-lg">
          <p className="font-display text-4xl font-semibold leading-none tracking-tight md:text-5xl">
            {item.speaker.replace("|", " / ")}
          </p>
          <p className="mt-3 max-w-[18rem] font-mono text-xs leading-snug text-[var(--poster-muted)]">
            {item.highlights[0]?.replace("#", "") ?? item.topic}
          </p>
        </div>
      )}
    </div>
  );
}

function PosterMark({ motif }: { motif: PosterTheme["motif"] }) {
  const props = {
    className: "h-full max-h-40 w-full max-w-48 text-[var(--poster-accent)]",
    viewBox: "0 0 160 132",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  const common = {
    stroke: "currentColor",
    strokeWidth: 5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const marks: Record<PosterTheme["motif"], ReactNode> = {
    agent: (
      <svg {...props}>
        <circle cx="80" cy="66" r="28" fill="currentColor" opacity="0.12" />
        <circle cx="80" cy="66" r="20" {...common} />
        <path d="M80 18v22M80 92v22M32 66h22M106 66h22M46 32l16 16M98 84l16 16M114 32 98 48M62 84l-16 16" {...common} />
      </svg>
    ),
    legal: (
      <svg {...props}>
        <path d="M80 24v84" {...common} />
        <path d="M46 42h68" {...common} />
        <path d="M46 42 28 78h36L46 42ZM114 42 96 78h36l-18-36Z" {...common} />
        <path d="M54 108h52" {...common} />
      </svg>
    ),
    travel: (
      <svg {...props}>
        <rect x="44" y="48" width="72" height="52" rx="10" {...common} />
        <path d="M64 48V36h32v12" {...common} />
        <path d="M44 68h72" {...common} opacity="0.45" />
        <path d="M62 100v10M98 100v10" {...common} />
        <path d="M118 36c14 7 22 18 24 34" {...common} opacity="0.45" />
        <path d="M134 68h8v-8" {...common} opacity="0.45" />
      </svg>
    ),
    autonomy: (
      <svg {...props}>
        <path d="M34 104h92" {...common} opacity="0.28" />
        <rect x="42" y="66" width="76" height="30" rx="15" {...common} />
        <path d="M58 66l12-18h26l12 18" {...common} />
        <circle cx="62" cy="98" r="8" fill="currentColor" />
        <circle cx="98" cy="98" r="8" fill="currentColor" />
        <path d="M80 36V20" {...common} opacity="0.55" />
        <path d="M56 42 44 30M104 42l12-12" {...common} opacity="0.55" />
        <path d="M34 58c-8 10-8 22 0 32M126 58c8 10 8 22 0 32" {...common} opacity="0.45" />
      </svg>
    ),
    growth: (
      <svg {...props}>
        <path d="M34 96h92" {...common} opacity="0.35" />
        <path d="M42 86 66 64l20 14 36-42" {...common} />
        <path d="M104 36h18v18" {...common} />
        <circle cx="66" cy="64" r="7" fill="currentColor" opacity="0.2" />
      </svg>
    ),
    community: (
      <svg {...props}>
        <circle cx="80" cy="60" r="18" {...common} />
        <circle cx="42" cy="82" r="14" {...common} opacity="0.65" />
        <circle cx="118" cy="82" r="14" {...common} opacity="0.65" />
        <path d="M50 108c12-12 48-12 60 0" {...common} />
      </svg>
    ),
    subscription: (
      <svg {...props}>
        <rect x="52" y="24" width="56" height="84" rx="14" {...common} />
        <path d="M68 42h24M68 90h24" {...common} opacity="0.45" />
        <path d="M116 54c12 12 12 28 0 40" {...common} />
        <path d="M44 94c-12-12-12-28 0-40" {...common} />
      </svg>
    ),
    food: (
      <svg {...props}>
        <circle cx="72" cy="70" r="36" {...common} />
        <circle cx="72" cy="70" r="14" fill="currentColor" opacity="0.14" />
        <path d="M116 34v74M130 34v74" {...common} />
        <path d="M112 60h22" {...common} />
      </svg>
    ),
    systems: (
      <svg {...props}>
        <rect x="34" y="32" width="36" height="36" rx="8" {...common} />
        <rect x="90" y="32" width="36" height="36" rx="8" {...common} opacity="0.65" />
        <rect x="62" y="82" width="36" height="36" rx="8" {...common} opacity="0.8" />
        <path d="M70 50h20M80 68v14" {...common} opacity="0.55" />
      </svg>
    ),
  };

  return marks[motif];
}

function getPosterTheme(item: TranscriptItem) {
  const haystack = `${item.slug} ${item.topic} ${item.highlights.join(" ")} ${item.searchText}`;
  const text = haystack.toLowerCase();
  if (hasAny(text, ["replit", "vibe", "agenti-ai", "software-senza-codice"])) {
    return theme("agent");
  }
  if (hasAny(text, ["legal", "avvocati", "lexroom", "diritto"])) {
    return theme("legal");
  }
  if (hasAny(text, ["bizaway", "business-travel", "travel-management"])) {
    return theme("travel");
  }
  if (hasAny(text, ["guida-autonoma", "mobilita", "robot-sharing", "niulinx"])) {
    return theme("autonomy");
  }
  if (hasAny(text, ["candy", "crescita-esponenziale", "lifetime-value", "payback"])) {
    return theme("growth");
  }
  if (hasAny(text, ["scuolazoo", "weroad", "community", "viaggi-come-business"])) {
    return theme("community");
  }
  if (hasAny(text, ["subbyx", "subscription", "accesso-non-possesso", "device"])) {
    return theme("subscription");
  }
  if (hasAny(text, ["farinetti", "cibo", "vino", "eataly", "luoghi"])) {
    return theme("food");
  }
  return theme("systems");
}

function theme(key: PosterTheme["key"]) {
  return THEMES.find((item) => item.key === key) ?? THEMES[THEMES.length - 1];
}

function hasAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function getInitials(speaker: string) {
  return speaker
    .replace("|", " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
