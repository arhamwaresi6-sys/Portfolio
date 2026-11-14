"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function ScrollPortrait() {
  const sceneRef = useRef(null);
  const firstFrameRef = useRef(null);
  const secondFrameRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const firstFrame = firstFrameRef.current;
    const secondFrame = secondFrameRef.current;

    if (!scene || !firstFrame || !secondFrame) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      return;
    }

    let frameId = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const bounds = scene.getBoundingClientRect();
        const travel = Math.max(bounds.height - window.innerHeight, 1);
        const progress = Math.min(1, Math.max(0, -bounds.top / travel));
        const secondProgress = Math.min(1, Math.max(0, (progress - 0.16) / 0.62));

        firstFrame.style.opacity = String(Math.max(0, 1 - progress * 1.5));
        firstFrame.style.transform = `scale(${1.04 - progress * 0.08}) translateY(${-progress * 24}px)`;
        secondFrame.style.opacity = String(secondProgress);
        secondFrame.style.transform = `scale(${1.12 - secondProgress * 0.12}) translateY(${(1 - secondProgress) * 28}px)`;
        scene.style.setProperty("--scene-progress", String(progress));
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="image-sequence__wrap scroll-scene"
      role="group"
      aria-label="Scroll-controlled portrait sequence"
    >
      <div className="image-sequence__sticky">
        <div className="scroll-col">
          <div className="image-sequence__element scroll-scene__frame">
            <div ref={firstFrameRef} className="scroll-scene__layer scroll-scene__layer--first">
              <Image
                src="/images/arham-portrait.webp"
                alt="Developer speaking at a lectern"
                fill
                priority
                sizes="(max-width: 760px) 90vw, 58vw"
                className="scroll-scene__image"
              />
            </div>
            <div ref={secondFrameRef} className="scroll-scene__layer scroll-scene__layer--second" aria-hidden="true">
              <Image
                src="/images/arham-presentation.webp"
                alt=""
                fill
                sizes="(max-width: 760px) 90vw, 58vw"
                className="scroll-scene__image"
              />
            </div>
            <div className="scroll-scene__shade" />
            <div className="scroll-scene__caption" aria-hidden="true">
              <span>ARHAM / FIELD NOTES</span>
              <span>SCROLL TO MOVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
