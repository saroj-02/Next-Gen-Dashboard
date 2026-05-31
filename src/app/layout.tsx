import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next-Gen Learning | Student Dashboard",
  description:
    "A futuristic student learning dashboard — track courses, streaks, and activity in real-time.",
  keywords: ["education", "learning", "dashboard", "courses", "student"],
  openGraph: {
    title: "Next-Gen Learning | Student Dashboard",
    description: "Track your learning journey with a futuristic dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full antialiased" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
        {children}
      </body>
    </html>
  );
}
