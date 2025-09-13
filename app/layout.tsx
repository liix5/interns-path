import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/main/nav";
import Footer from "@/components/main/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
  ],
  authors: [{ name: "Layan", url: "https://x.com/ot_layan5" }],
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
        url: "/ogInternspath.png", // مسار الصورة
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
    images: ["/ogInternspath.png"], // نفس الصورة
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {" "}
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
