"use client";

import { useState } from "react";
import { useQuranStore } from "@/stores/quran-store";
import { Heart, Trash2 } from "lucide-react";

export function SavedWords() {
  const { favoriteWords, toggleFavoriteWord } = useQuranStore();
  const [showAll, setShowAll] = useState(false);

  if (favoriteWords.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-6">
        Henüz kelime eklemediniz. Kur&apos;an okurken kelimelerin üstüne tıklayıp
        <Heart className="inline h-3.5 w-3.5 mx-1 text-red-400" fill="#f87171" />
        butonuna basın.
      </div>
    );
  }

  const displayed = showAll ? favoriteWords : favoriteWords.slice(0, 6);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {displayed.map((word) => (
          <div
            key={word.id}
            className="group relative bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1 hover:border-primary/30 transition-colors"
          >
            <button
              type="button"
              onClick={() => toggleFavoriteWord(word)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950"
              title="Kaldır"
            >
              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
            </button>
            <span className="font-arabic text-2xl text-foreground leading-loose">
              {word.arabic}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {word.transcription_tr}
            </span>
            <span className="text-sm font-semibold text-primary text-center">
              {word.translation_tr}
            </span>
            {word.root && (
              <span className="text-xs text-muted-foreground font-mono">
                {word.root.latin}
              </span>
            )}
          </div>
        ))}
      </div>
      {favoriteWords.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 text-sm text-primary hover:underline w-full text-center"
        >
          {showAll ? "Daha az göster" : `Tümünü göster (${favoriteWords.length})`}
        </button>
      )}
    </div>
  );
}
