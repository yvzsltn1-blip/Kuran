"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useQuranStore } from "@/stores/quran-store";

interface WordPart {
  id: number;
  sort_number: number;
  arabic: string;
  transcription_tr: string;
  translation_tr: string;
  root: { id: number; latin: string; arabic: string } | null;
}

interface InteractiveArabicProps {
  surahId: number;
  verseNumber: number;
  fallbackText: string;
  fontSize: number;
}

async function fetchVerseWords(surahId: number, verseNumber: number): Promise<WordPart[]> {
  const res = await fetch(`https://api.acikkuran.com/surah/${surahId}/verse/${verseNumber}/verseparts`);
  if (!res.ok) throw new Error("fetch failed");
  const json = await res.json();
  const words = json?.data;
  if (!Array.isArray(words) || words.length === 0) throw new Error("no words");
  return words;
}

const POPUP_W = 192;

function WordButton({
  word,
  fontSize,
  surahId,
  verseNumber,
}: {
  word: WordPart;
  fontSize: number;
  surahId: number;
  verseNumber: number;
}) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const translitSize = Math.max(10, Math.round(fontSize * 0.38));
  const popupFontSize = Math.min(fontSize, 30);
  const { toggleFavoriteWord, isFavoriteWord } = useQuranStore();
  const wordId = `${surahId}:${verseNumber}:${word.id}`;
  const isFav = isFavoriteWord(wordId);

  const calcStyle = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const spaceAbove = r.top;
    const spaceBelow = window.innerHeight - r.bottom;
    const above = spaceAbove >= 180 || spaceAbove > spaceBelow;
    let left = r.left + r.width / 2 - POPUP_W / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - POPUP_W - 8));
    setStyle(
      above
        ? { position: "fixed", bottom: window.innerHeight - r.top + 8, left, zIndex: 9999 }
        : { position: "fixed", top: r.bottom + 8, left, zIndex: 9999 }
    );
  }, []);

  // Dışarı tıklama/dokunma ile kapat — timeout ile açan event'in geçmesini bekle
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (popupRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const id = window.setTimeout(() => {
      document.addEventListener("mousedown", close);
      document.addEventListener("touchstart", close);
    }, 50);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  function handleClick() {
    calcStyle();
    setOpen((v) => !v);
  }

  const popup = open && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={popupRef}
          style={style}
          className="w-48 rounded-lg border border-border bg-popover shadow-xl p-3 text-center"
          dir="ltr"
        >
          <div className="font-arabic text-foreground leading-loose" style={{ fontSize: `${popupFontSize}px` }}>
            {word.arabic}
          </div>
          {word.transcription_tr && (
            <div className="text-xs text-muted-foreground font-mono mt-0.5">{word.transcription_tr}</div>
          )}
          <div className="border-t border-border mt-2 pt-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">
              {word.translation_tr || <span className="text-muted-foreground font-normal italic text-xs">çeviri yok</span>}
            </span>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteWord({
                  id: wordId,
                  arabic: word.arabic,
                  transcription_tr: word.transcription_tr,
                  translation_tr: word.translation_tr,
                  root: word.root,
                  savedAt: new Date().toISOString(),
                });
              }}
              className="shrink-0 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              title={isFav ? "Favorilerden çıkar" : "Kelimelerime ekle"}
            >
              <Heart
                className="h-4 w-4"
                style={{ color: isFav ? "#ef4444" : undefined }}
                fill={isFav ? "#ef4444" : "none"}
              />
            </button>
          </div>
          {word.root && (
            <div className="text-xs text-muted-foreground border-t border-border mt-2 pt-2 space-y-0.5">
              <div>Kök: <span className="font-arabic text-sm">{word.root.arabic}</span></div>
              <div className="font-mono">{word.root.latin}</div>
            </div>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative flex flex-col items-center" dir="rtl">
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        className="flex flex-col items-center rounded-md px-1 py-0.5 transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="font-arabic text-foreground leading-loose" style={{ fontSize: `${fontSize}px` }}>
          {word.arabic}
        </span>
        {word.transcription_tr && (
          <span
            className="text-muted-foreground font-mono leading-none mt-0.5 select-none"
            style={{ fontSize: `${translitSize}px` }}
            dir="ltr"
          >
            {word.transcription_tr}
          </span>
        )}
      </button>
      {popup}
    </div>
  );
}

export function InteractiveArabic({
  surahId,
  verseNumber,
  fallbackText,
  fontSize,
}: InteractiveArabicProps) {
  const { data: words, isLoading, isError } = useQuery({
    queryKey: ["verse-words", surahId, verseNumber],
    queryFn: () => fetchVerseWords(surahId, verseNumber),
    staleTime: Infinity,
    retry: 1,
  });

  if (isLoading || isError || !words?.length) {
    return (
      <div className="font-arabic text-right text-foreground leading-loose" style={{ fontSize: `${fontSize}px` }}>
        {fallbackText}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-x-1 gap-y-4" dir="rtl">
      {words.map((word) => (
        <WordButton key={word.id} word={word} fontSize={fontSize} surahId={surahId} verseNumber={verseNumber} />
      ))}
    </div>
  );
}
