"use client";

import { useEffect } from "react";

export function CarouselHydrationReady() {
  useEffect(() => {
    const carousel = document.querySelector("[data-glass-carousel]");
    if (!carousel) return;

    carousel.setAttribute("data-glass-carousel-ready", "");
    window.portfolioSite?.refreshCarousel?.();
  }, []);

  return null;
}
