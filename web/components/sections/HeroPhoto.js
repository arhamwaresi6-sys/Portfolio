"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function HeroPhoto({
  altText,
  variant = "hero",
  src = "/images/arham/photo-cutout.png",
  width = 1744,
  height = 1600,
  priority = false,
  className = "",
}) {
  const photoRef = useRef(null);

  useEffect(() => {
    const element = photoRef.current;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!element || !desktop.matches || reducedMotion.matches) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const bounds = element.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
      element.style.setProperty("--hero-photo-x", `${x.toFixed(1)}px`);
      element.style.setProperty("--hero-photo-y", `${y.toFixed(1)}px`);
    };

    const resetPosition = () => {
      element.style.setProperty("--hero-photo-x", "0px");
      element.style.setProperty("--hero-photo-y", "0px");
    };

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", resetPosition);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", resetPosition);
    };
  }, []);

  const imageStyle = { aspectRatio: `${width} / ${height}` };

  return (
    <div
      ref={photoRef}
      className={`hero-photo hero-photo--${variant} ${className}`.trim()}
      style={imageStyle}
    >
      <div className="hero-photo__glow" aria-hidden="true" />
      <div className="hero-photo__stage">
        <Image
          className="hero-photo__rim"
          src={src}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          sizes="(max-width: 767px) 90vw, (max-width: 1199px) 55vw, 48vw"
          priority={priority}
        />
        <Image
          className="hero-photo__image"
          src={src}
          alt={altText}
          width={width}
          height={height}
          sizes="(max-width: 767px) 90vw, (max-width: 1199px) 55vw, 48vw"
          placeholder="blur"
          blurDataURL="/images/arham/photo-blur.png"
          priority={priority}
        />
      </div>
      <span className="hero-photo__grain" aria-hidden="true" />
    </div>
  );
}
