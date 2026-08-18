import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LavaGo | Encontre a melhor estética automotiva perto de você",
  description:
    "Descubra, compare e avalie os melhores lava-jatos e centros de estética automotiva da sua região em tempo real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} dark`}
    >
      <body className="bg-surface-background text-text-primary font-sans antialiased selection:bg-brand-primary selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
