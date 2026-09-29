"use client";

import Script from "next/script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

export function FooterSocial() {
  return (
    <div className="lg:pl-8 xl:pl-16">
      <h2 className="text-center sm:text-left text-2xl sm:text-3xl font-bold tracking-tight">
        Nos acompanhe
      </h2>

      <div className="mt-6 mb-10 flex justify-center sm:block">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink="https://www.instagram.com/biarritzsports/"
          data-instgrm-version="14"
          style={{
            width: "100%",
            maxWidth: 360,
            borderRadius: 12,
          }}
        />
      </div>

      <ul className="space-y-4 text-sm sm:text-base text-muted">
        <li className="flex items-center justify-center sm:justify-start gap-3 text-brand text-brand-dark-hover">
          <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />

          <a
            href="https://www.facebook.com/biarritzsports/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-dark transition-colors"
          >
            /biarritzturismosports
          </a>
        </li>

        <li className="flex items-center justify-center sm:justify-start gap-3 text-brand text-brand-dark-hover">
          <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />

          <a
            href="https://api.whatsapp.com/send?phone=5551981442091"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-dark transition-colors"
          >
            51 98144-2091
          </a>
        </li>
      </ul>

      <p className="mt-8 text-center sm:text-left text-xl sm:text-2xl font-bold text-brand-dark">
        (51) 3026.2233
      </p>

      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.instgrm?.Embeds?.process();
        }}
      />
    </div>
  );
}
