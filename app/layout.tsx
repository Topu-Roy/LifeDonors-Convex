import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Montserrat } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/Navbar";

const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: {
    template: "%s | LifeDonors",
    default: "LifeDonors | Give Blood, Save a Life",
  },
  description:
    "LifeDonors is a modern platform connecting blood donors with those in need. Find requests, manage your profile, and save lives in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}>
        <ConvexClientProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
