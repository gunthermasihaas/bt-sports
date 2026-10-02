import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import OrganizationJsonLd from "./seo/OrganizationJsonLd";
import Providers from "./providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Biarritz Turismo Sports";

const siteDescription =
  "Pacotes e experiências de turismo esportivo para quem quer viver grandes eventos esportivos de perto.";

const baseUrl = "https://www.biarritz.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },

  description: siteDescription,

  applicationName: siteName,

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    siteName,
    title: siteName,
    description: siteDescription,
  },

  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
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
          {children}

          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
