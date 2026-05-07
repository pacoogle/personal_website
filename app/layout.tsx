import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-82GYP2DN05";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-outfit",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Pasquale Ragozzino",
  description:
    "CTO in Gamindo. Ingegneria con intenzione — tecnologia, cultura e comunità.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${outfit.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-white font-sans text-charcoal">
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
