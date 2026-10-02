import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { authOptions } from "@/lib/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role ?? null;

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrganizationJsonLd />

        <Providers>
          <Header role={role} />
          {children}
          <Toaster richColors position="top-right" />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
