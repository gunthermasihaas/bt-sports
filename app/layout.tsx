import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Providers from "./providers";
import OrganizationJsonLd from "./seo/OrganizationJsonLd";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.biarritz.com.br"),

  title: {
    default: "Biarritz Turismo Sports",
    template: "%s | Biarritz Turismo Sports",
  },

  description:
    "Pacotes e experiências de turismo esportivo para quem quer viver grandes eventos esportivos de perto.",

  applicationName: "Biarritz Turismo Sports",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.biarritz.com.br",
    siteName: "Biarritz Turismo Sports",
    title: "Biarritz Turismo Sports",
    description:
      "Pacotes e experiências de turismo esportivo para quem quer viver grandes eventos esportivos de perto.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Biarritz Turismo Sports",
    description:
      "Pacotes e experiências de turismo esportivo para quem quer viver grandes eventos esportivos de perto.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrganizationJsonLd />

        <Providers>
          <Header />
          {children}
          <Toaster richColors position="top-right" />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
