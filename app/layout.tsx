import { Inter, Newsreader, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/main/nav";
import Footer from "@/components/main/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "500",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://internspath.com"),
  title: "InternsPath | مسار الامتياز",
  description:
    "شارك تجربتك واقرأ تجارب الآخرين لتحديد أفضل اختيار للتدريب في سنة الامتياز.",
  keywords: [
    "Interns Path",
    "InternsPath",
    "Interns",
    "Path",
    "intern path",
    "تجارب الامتياز",
    "تدريب",
    "الامتياز",
    "امتياز",
    "تجارب طلابية",
    "مستشفيات",
    "سعودية",
    "طلاب الطب",
    "علاج وظيفي",
    "علاج طبيعي",
    "مستشفى",
    "سنة الامتياز",
    "تجارب سنة الامتياز",
    "تجارب تدريب المستشفيات",
    "تجارب طلاب الامتياز في السعودية",
    "تجربة تدريب علاج وظيفي",
    "تجربة تدريب علاج طبيعي",
    "تجربة امتياز مستشفى حكومي",
    "تجربة امتياز مستشفى خاص",
    "امتياز علاج وظيفي",
    "امتياز علاج طبيعي",
    "امتياز تمريض",
    "امتياز طب",
    "تجارب امتياز علاج وظيفي السعودية",
    "تجارب تدريب صحي",
    "أفضل مستشفى للامتياز",
    "كيف اختار مستشفى الامتياز",
    "تجارب امتياز حقيقية",
    "تقييم تدريب المستشفيات",
    "مسار الامتياز",
  ],
  authors: [{ name: "Layan", url: "https://x.com/internspathSA" }],
  openGraph: {
    title: "InternsPath | مسار الامتياز",
    description:
      "شارك تجربتك واقرأ تجارب الآخرين لتحديد أفضل اختيار للتدريب في سنة الامتياز.",
    url: "https://internspath.com",
    siteName: "InternsPath",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "InternsPath",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InternsPath | مسار الامتياز",
    creator: "@internspathSA",
    description:
      "شارك تجربتك واقرأ تجارب الآخرين لتحديد أفضل اختيار للتدريب في سنة الامتياز.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="ar" className="scroll-smooth">
      <body
        className={`${inter.variable} ${newsreader.variable} ${ibmPlexSansArabic.variable} flex flex-col min-h-screen antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {" "}
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster dir="rtl" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
