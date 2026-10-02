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
    <div className="lg:min-w-80">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          Conecte-se
        </span>

        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
          Nos acompanhe
        </h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white/5">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink="https://www.instagram.com/biarritzsports/"
          data-instgrm-version="14"
          style={{
            width: "100%",
            maxWidth: 360,
            margin: "0 auto",
            borderRadius: 16,
          }}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 text-sm text-white/65">
        <a
          href="https://www.facebook.com/biarritzsports/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <FontAwesomeIcon icon={faFacebookF} className="h-4 w-4" />
          </span>

          <span>/biarritzturismosports</span>
        </a>

        <a
          href="https://api.whatsapp.com/send?phone=5551981442091"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
          </span>

          <span>51 98144-2091</span>
        </a>
      </div>

      <a
        href="tel:+555130262233"
        className="mt-6 block text-2xl font-extrabold tracking-tight text-brand transition hover:text-white"
      >
        (51) 3026.2233
      </a>

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
