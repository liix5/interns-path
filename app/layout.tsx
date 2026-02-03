import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/main/nav";
import Footer from "@/components/main/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://internspath.com"),
  title: "Interns Path",
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
  ],
  authors: [{ name: "Layan", url: "https://x.com/internspathSA" }],
  openGraph: {
    title: "Interns Path",
    description:
      "شارك تجربتك واقرأ تجارب الآخرين لتحديد أفضل اختيار للتدريب في سنة الامتياز.",
    url: "https://internspath.com",
    siteName: "Interns Path",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Interns Path",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interns Path",
    description:
      "شارك تجربتك واقرأ تجارب الآخرين لتحديد أفضل اختيار للتدريب في سنة الامتياز.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
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
