"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQuranStore } from "@/stores/quran-store";
import { useSurahName } from "@/hooks/use-surah-name";
import { getVerseByReference } from "@/services/quran-api";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";

interface VerseData {
  surahId: number;
  verseNumber: number;
  arabic: string;
  translation: string;
}

async function fetchVerseData(surahId: number, verseNumber: number): Promise<VerseData> {
  const verse = await getVerseByReference(surahId, verseNumber);
  return {
    surahId,
    verseNumber,
    arabic: verse?.text_arabic || "",
    translation: verse?.translations.tr || "",
  };
}

function VerseCard({ bookmarkId }: { bookmarkId: string }) {
  const [surahId, verseNumber] = bookmarkId.split(":").map(Number);
  const { getSurahName } = useSurahName();
  const { toggleBookmark } = useQuranStore();

  const { data, isLoading } = useQuery({
    queryKey: ["dash-verse", surahId, verseNumber],
    queryFn: () => fetchVerseData(surahId, verseNumber),
    staleTime: Infinity,
  });

  return (
    <div className="group bg-card border border-border rounded-xl p-4 border-l-4 border-l-primary/30 hover:border-l-primary/60 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Bookmark className="h-3.5 w-3.5 text-primary shrink-0" />
          <Link
            href={`/quran/surah?id=${surahId}`}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {getSurahName(surahId)}, {verseNumber}. Ayet
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        <button
          type="button"
          onClick={() => toggleBookmark(bookmarkId)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-destructive/10"
          title="İşareti kaldır"
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
        </button>
      </div>

      {isLoading ? (
        <div className="h-10 bg-muted/30 rounded animate-pulse" />
      ) : (
        <>
          <p className="font-arabic text-right text-lg leading-loose text-foreground mb-2">
            {data?.arabic}
          </p>
          {data?.translation && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {data.translation}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function SavedVerses() {
  const { bookmarks } = useQuranStore();
  const [showAll, setShowAll] = useState(false);

  // Sadece sure:ayet formatındaki bookmarkları al (page- olanları hariç)
  const verseBookmarks = bookmarks.filter((b) => /^\d+:\d+$/.test(b.id));

  if (verseBookmarks.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-6">
        Henüz ayet işaretlemediniz. Kur&apos;an okurken
        <Bookmark className="inline h-3.5 w-3.5 mx-1" />
        butonuna basın.
      </div>
    );
  }

  const sorted = [...verseBookmarks].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const displayed = showAll ? sorted : sorted.slice(0, 4);

  return (
    <div>
      <div className="space-y-3">
        {displayed.map((bookmark) => (
          <VerseCard key={bookmark.id} bookmarkId={bookmark.id} />
        ))}
      </div>
      {verseBookmarks.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 text-sm text-primary hover:underline w-full text-center"
        >
          {showAll ? "Daha az göster" : `Tümünü göster (${verseBookmarks.length})`}
        </button>
      )}
    </div>
  );
}
