"use client";

import { useEffect } from "react";

const SCRIPT_SRCS = [
  "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js",
  "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js",
  "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js",
  "https://cdn.jsdelivr.net/npm/hls.js@1.6.11",
  "https://cdn.jsdelivr.net/npm/locomotive-scroll/bundled/locomotive-scroll.min.js",
];

const EFFECTS_SRC = "/js/portfolio-effects.js";

function loadScript(src, { force = false } = {}) {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[data-site-effect="${src}"]`);

    if (existing && !force) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    if (existing && force) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.src = force ? `${src}?t=${Date.now()}` : src;
    script.async = false;
    script.dataset.siteEffect = src;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      console.warn(`[SiteEffects] Failed to load ${src}`);
      resolve();
    };
    document.body.appendChild(script);
  });
}

export function SiteEffects() {
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      for (const src of SCRIPT_SRCS) {
        if (cancelled) return;
        await loadScript(src);
      }

      if (cancelled) return;

      if (window.portfolioSite?.boot) {
        window.portfolioSite.boot();
        return;
      }

      await loadScript(EFFECTS_SRC, { force: true });
    };

    boot();

    return () => {
      cancelled = true;
      window.portfolioSite?.destroy?.();
    };
  }, []);

  return null;
}
