"use client";
import React, { useEffect, useMemo, useRef } from "react";

type LetterPosition = {
  x: number;
  y: number;
  letter: string;
};

type LetterInstance = LetterPosition & {
  timestamp: number;
  fadeout: number;
};

/**
 * GlowingLettersBackground
 * Renders a subtle glowing letter grid background across the full document height.
 */
export default function GlowingLettersBackground() {
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  const LETTER_FADE_DURATION = useMemo<[number, number]>(() => [1.5, 9], []); // seconds

  // state held in refs to avoid re-renders
  const widthRef = useRef<number>(0);
  const heightRef = useRef<number>(0);
  const letterPositionsRef = useRef<LetterPosition[]>([]);
  const letterInstancesRef = useRef<LetterInstance[]>([]);
  const colorRgbRef = useRef<string>("139, 78, 229"); // fallback to a soft purple
  const rafRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const getDocSize = () => {
    const width = document.documentElement.clientWidth;
    const height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.offsetHeight
    );
    return { width, height };
  };

  const easeInOutSine = (timestamp: number, start: number, end: number) => {
    const total = end - start;
    if (timestamp < start) return 0;
    if (timestamp > end) {
      const elapsedAfterEnd = timestamp - end;
      const progressAfterEnd = elapsedAfterEnd / (total / 2);
      return Math.sin(progressAfterEnd * Math.PI);
    }
    const progress = (timestamp - start) / total;
    return Math.max(0, 0.5 - 0.5 * Math.cos(progress * Math.PI));
  };

  const getRandomAmountFromArray = <T,>(arr: T[], n = 20): T[] => {
    const len = arr.length;
    if (n > len) throw new Error("getRandomAmountFromArray: more elements taken than available");
    const result = new Array<T>(n);
    const taken = new Array<number>(len);
    let l = len;
    let i = n;
    while (i--) {
      const x = Math.floor(Math.random() * l);
      result[i] = arr[x in taken ? taken[x]! : x];
      taken[x] = --l in taken ? taken[l]! : l;
    }
    return result;
  };

  const initBackground = (baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) => {
    letterPositionsRef.current = [];
    letterInstancesRef.current = [];

    const { width, height } = getDocSize();
    widthRef.current = width;
    heightRef.current = height;

    const baseCanvas = baseRef.current!;
    const overlayCanvas = overlayRef.current!;
    baseCanvas.width = width;
    baseCanvas.height = height;
    overlayCanvas.width = width;
    overlayCanvas.height = height;

    // Try to get color from CSS var --primary-rgb, else fallback remains
    try {
      const cssVal = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-rgb")
        .trim();
      if (cssVal) colorRgbRef.current = cssVal;
    } catch {}

    // Text source: from document.title (before the first " | ") or default
    let text = (document.title.toLowerCase().split(" | ")[0] || "spectre").replace(/\s/g, "_");
    if (text.includes("_")) text += "_"; // separate words further

    // Layout constants
    const stepX = 17; // letter width
    const stepY = 35; // letter height
    const letters = Math.ceil(width / stepX);
    const lines = Math.ceil(height / stepY);

    // Static layer (very faint)
    for (let i = 0; i < lines; i++) {
      for (let j = 0; j < letters; j++) {
        baseCtx.font = "28px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
        baseCtx.textAlign = "start";
        baseCtx.textBaseline = "top";
        baseCtx.fillStyle = "rgba(161, 112, 253, 0.02)";
        const ch = text[j % text.length];
        baseCtx.fillText(ch, j * stepX, i * stepY);
        letterPositionsRef.current.push({ x: j * stepX, y: i * stepY, letter: ch });
      }
    }

    // Pick many letters for animation on the overlay
    const randomLetters = getRandomAmountFromArray<LetterPosition>(
      letterPositionsRef.current,
      Math.max(1, Math.min(letterPositionsRef.current.length, Math.floor(letterPositionsRef.current.length * 0.05)))
    );

    for (const letter of randomLetters) {
      overlayCtx.font = "bold 28px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
      overlayCtx.textAlign = "start";
      overlayCtx.textBaseline = "top";
      overlayCtx.fillStyle = `rgba(${colorRgbRef.current}, 0)`;
      overlayCtx.shadowBlur = 6;
      overlayCtx.shadowColor = `rgba(${colorRgbRef.current}, 0)`;
      overlayCtx.fillText(letter.letter, letter.x, letter.y);

      const animLength = LETTER_FADE_DURATION[0] + Math.random() * (LETTER_FADE_DURATION[1] - LETTER_FADE_DURATION[0]);
      letterInstancesRef.current.push({
        x: letter.x,
        y: letter.y,
        letter: letter.letter,
        timestamp: Date.now(),
        fadeout: Date.now() + animLength * 1000,
      });
    }

    baseCanvas.style.opacity = "1";
  };

  const redraw = (overlayCtx: CanvasRenderingContext2D) => {
    overlayCtx.clearRect(0, 0, overlayRef.current!.width, overlayRef.current!.height);

    const now = Date.now();
    for (let idx = letterInstancesRef.current.length - 1; idx >= 0; idx--) {
      const letter = letterInstancesRef.current[idx];
      if (letter.fadeout > now) continue;

      const alpha = easeInOutSine(now, letter.timestamp, letter.fadeout);
      if (alpha <= 0 && now > letter.fadeout) {
        letterInstancesRef.current.splice(idx, 1);
        const [randomLetter] = getRandomAmountFromArray(letterPositionsRef.current, 1);
        const animLength = LETTER_FADE_DURATION[0] + Math.random() * (LETTER_FADE_DURATION[1] - LETTER_FADE_DURATION[0]);
        letterInstancesRef.current.push({
          x: randomLetter.x,
          y: randomLetter.y,
          letter: randomLetter.letter,
          timestamp: now,
          fadeout: now + animLength * 1000,
        });
        continue;
      }

      overlayCtx.font = "bold 28px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
      overlayCtx.textAlign = "start";
      overlayCtx.textBaseline = "top";
      overlayCtx.fillStyle = `rgba(${colorRgbRef.current}, ${alpha})`;
      overlayCtx.shadowBlur = 16;
      overlayCtx.shadowColor = `rgba(${colorRgbRef.current}, ${alpha})`;
      overlayCtx.fillText(letter.letter, letter.x, letter.y);
    }

    rafRef.current = requestAnimationFrame(() => redraw(overlayCtx));
  };

  const resizeAll = (baseCtx: CanvasRenderingContext2D, overlayCtx: CanvasRenderingContext2D) => {
    const baseCanvas = baseRef.current!;
    const overlayCanvas = overlayRef.current!;

    const { width, height } = getDocSize();
    widthRef.current = width;
    heightRef.current = height;

    baseCanvas.width = width;
    baseCanvas.height = height;
    overlayCanvas.width = width;
    overlayCanvas.height = height;

    baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    initBackground(baseCtx, overlayCtx);
  };

  useEffect(() => {
    const baseCanvas = baseRef.current;
    const overlayCanvas = overlayRef.current;
    if (!baseCanvas || !overlayCanvas) return;

    const baseCtx = baseCanvas.getContext("2d");
    const overlayCtx = overlayCanvas.getContext("2d");
    if (!baseCtx || !overlayCtx) return;

    initBackground(baseCtx, overlayCtx);
    rafRef.current = requestAnimationFrame(() => redraw(overlayCtx));

    const onResize = () => resizeAll(baseCtx, overlayCtx);
    window.addEventListener("resize", onResize);
    resizeObserverRef.current = new ResizeObserver(onResize);
    resizeObserverRef.current.observe(document.body);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 bg-black">
      <canvas ref={baseRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={overlayRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
