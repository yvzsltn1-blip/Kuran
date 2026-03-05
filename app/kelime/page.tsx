"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { useQuranStore, FavoriteWord } from "@/stores/quran-store";
import { Header } from "@/components/layout/header";
import { VerseComponent } from "@/components/quran/verse-component";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSurahName } from "@/hooks/use-surah-name";
import { getVerseByReference } from "@/services/quran-api";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  Heart,
  Bookmark,
  BookOpen,
} from "lucide-react";
import type { Verse } from "@/types/quran";

// ─── Kelimelerim Sekmesi ──────────────────────────────────────────────────────

type CardState = "front" | "back";

function KelimelerimTab() {
  const { favoriteWords, toggleFavoriteWord } = useQuranStore();
  const { user, updateProgress } = useAuth();

  const [cards, setCards] = useState<FavoriteWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>("front");
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [unknownIds, setUnknownIds] = useState<Set<string>>(new Set());
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    setCards([...favoriteWords].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setCardState("front");
    setKnownIds(new Set());
    setUnknownIds(new Set());
    setSessionComplete(false);
  }, [favoriteWords.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = cards[currentIndex];
  const flip = () => setCardState((s) => (s === "front" ? "back" : "front"));

  const markKnown = useCallback(() => {
    if (!current) return;
    const newKnown = new Set(knownIds).add(current.id);
    setKnownIds(newKnown);
    if (currentIndex + 1 >= cards.length) {
      setSessionComplete(true);
      updateProgress({ wordsLearned: (user?.progress.wordsLearned || 0) + newKnown.size });
    } else {
      setCurrentIndex((i) => i + 1);
      setCardState("front");
    }
  }, [current, currentIndex, cards.length, knownIds, user, updateProgress]);

  const markUnknown = useCallback(() => {
    if (!current) return;
    setUnknownIds((prev) => new Set(prev).add(current.id));
    if (currentIndex + 1 >= cards.length) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setCardState("front");
    }
  }, [current, currentIndex, cards.length]);

  const restart = () => {
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setCardState("front");
    setKnownIds(new Set());
    setUnknownIds(new Set());
    setSessionComplete(false);
  };

  if (favoriteWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <Heart className="h-16 w-16 text-muted-foreground/30" />
        <h3 className="text-xl font-semibold text-foreground">Henüz kelime eklemediniz</h3>
        <p className="text-muted-foreground max-w-sm">
          Kur&apos;an okurken herhangi bir kelimenin üstüne tıklayın ve{" "}
          <Heart className="inline h-3.5 w-3.5 text-red-400" fill="#f87171" />{" "}
          butonuna basarak kelimenizi buraya ekleyin.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <a href="/quran/surahs">
            <BookOpen className="h-4 w-4 mr-2" />
            Kur&apos;an&apos;a Git
          </a>
        </Button>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Oturum tamamlandı!</h2>
        <p className="text-muted-foreground mb-2">
          <span className="text-emerald-500 font-semibold">{knownIds.size}</span> kelime biliyorsunuz,{" "}
          <span className="text-red-500 font-semibold">{unknownIds.size}</span> tekrar gerekiyor.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button onClick={restart} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <RotateCcw className="h-4 w-4" />
            Tekrar Et
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* İlerleme */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${cards.length ? (currentIndex / cards.length) * 100 : 0}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground shrink-0">
          {currentIndex}/{cards.length}
        </span>
        <div className="flex gap-2 text-xs shrink-0">
          <span className="text-emerald-500 font-medium">{knownIds.size} ✓</span>
          <span className="text-red-500 font-medium">{unknownIds.size} ✗</span>
        </div>
      </div>

      {/* Kart */}
      {current && (
        <>
          <div
            onClick={flip}
            className="cursor-pointer bg-card border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center text-center hover:border-accent/40 transition-all duration-200 shadow-sm hover:shadow-md select-none relative"
          >
            {/* Favori kaldır butonu */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleFavoriteWord(current); }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              title="Favorilerden çıkar"
            >
              <Heart className="h-4 w-4 text-red-400" fill="#f87171" />
            </button>

            {cardState === "front" ? (
              <>
                {current.root && (
                  <div className="text-xs font-medium text-accent mb-4 bg-accent/10 px-3 py-1 rounded-full font-mono">
                    {current.root.latin}
                  </div>
                )}
                <div className="font-arabic text-6xl text-foreground leading-relaxed mb-4">
                  {current.arabic}
                </div>
                <div className="text-muted-foreground text-sm italic">{current.transcription_tr}</div>
                <div className="mt-6 text-xs text-muted-foreground/60">Kartı çevirmek için tıklayın</div>
              </>
            ) : (
              <>
                <div className="text-xs font-medium text-emerald-500 mb-4 bg-emerald-500/10 px-3 py-1 rounded-full">
                  Türkçe Anlamı
                </div>
                <div className="text-3xl font-bold text-foreground mb-3">{current.translation_tr}</div>
                <div className="font-arabic text-2xl text-muted-foreground mb-2">{current.arabic}</div>
                <div className="text-sm text-muted-foreground font-mono">{current.transcription_tr}</div>
                {current.root && (
                  <div className="mt-4 p-3 bg-background rounded-xl border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Kök</div>
                    <div className="font-arabic text-lg text-foreground">{current.root.arabic}</div>
                    <div className="text-xs font-mono text-muted-foreground">{current.root.latin}</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex gap-4 mt-6">
            <Button
              onClick={markUnknown}
              variant="outline"
              className="flex-1 h-14 text-base gap-2 border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 rounded-2xl"
            >
              <X className="h-5 w-5" />
              Bilmiyorum
            </Button>
            <Button onClick={flip} variant="outline" className="h-14 px-4 rounded-2xl">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={markKnown}
              className="flex-1 h-14 text-base gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl"
            >
              <Check className="h-5 w-5" />
              Biliyorum
            </Button>
          </div>

          {/* Navigasyon */}
          <div className="flex justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => { setCurrentIndex((i) => i - 1); setCardState("front"); }}
              className="gap-1 text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentIndex + 1 >= cards.length}
              onClick={() => { setCurrentIndex((i) => i + 1); setCardState("front"); }}
              className="gap-1 text-muted-foreground"
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </>
  );
}

// ─── Ayetlerim Sekmesi ────────────────────────────────────────────────────────

async function fetchVerseForBookmark(surahId: number, verseNumber: number): Promise<Verse | null> {
  try {
    return await getVerseByReference(surahId, verseNumber);
  } catch {
    return null;
  }
}

function BookmarkedVerse({ bookmarkId }: { bookmarkId: string }) {
  const [surahId, verseNumber] = bookmarkId.split(":").map(Number);
  const { toggleBookmark } = useQuranStore();
  const { getSurahName } = useSurahName();

  const { data: verse, isLoading } = useQuery({
    queryKey: ["kelime-verse", surahId, verseNumber],
    queryFn: () => fetchVerseForBookmark(surahId, verseNumber),
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="h-32 bg-card border border-border rounded-xl flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!verse) return null;

  return (
    <div className="relative group">
      <VerseComponent
        verse={verse}
        showTranslation
        translationLanguage="tr"
        fontSize={24}
      />
      {/* Ayet kaldır butonu */}
      <button
        type="button"
        onClick={() => toggleBookmark(bookmarkId)}
        title={`${getSurahName(surahId)} ${verseNumber}. ayeti kaldır`}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg px-2 py-1 z-10"
      >
        <X className="h-3 w-3" />
        Kaldır
      </button>
    </div>
  );
}

function AyetlerimTab() {
  const { bookmarks } = useQuranStore();
  const verseBookmarks = bookmarks.filter((b) => /^\d+:\d+$/.test(b.id));
  const sorted = [...verseBookmarks].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <Bookmark className="h-16 w-16 text-muted-foreground/30" />
        <h3 className="text-xl font-semibold text-foreground">Henüz ayet işaretlemediniz</h3>
        <p className="text-muted-foreground max-w-sm">
          Kur&apos;an okurken{" "}
          <Bookmark className="inline h-3.5 w-3.5" />{" "}
          butonuna basarak ayetleri buraya ekleyin.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <a href="/quran/surahs">
            <BookOpen className="h-4 w-4 mr-2" />
            Kur&apos;an&apos;a Git
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((bookmark) => (
        <BookmarkedVerse key={bookmark.id} bookmarkId={bookmark.id} />
      ))}
    </div>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────

type Tab = "kelimeler" | "ayetler";

export default function KelimePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { favoriteWords, bookmarks } = useQuranStore();
  const [activeTab, setActiveTab] = useState<Tab>("kelimeler");

  const verseCount = bookmarks.filter((b) => /^\d+:\d+$/.test(b.id)).length;

  useEffect(() => {
    if (!isLoading && !user) router.push("/giris");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Başlık + Sekmeler */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Kütüphanem</h1>
          <p className="text-muted-foreground text-sm mb-4">Kaydettiğiniz kelimeler ve ayetler</p>

          <div className="flex gap-1 bg-muted rounded-xl p-1">
            <button
              onClick={() => setActiveTab("kelimeler")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "kelimeler"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <Heart
                className="h-4 w-4 shrink-0"
                style={{ color: "#ef4444" }}
                fill={activeTab === "kelimeler" ? "#ef4444" : "none"}
              />
              <span>Kelimelerim</span>
              {favoriteWords.length > 0 && (
                <span className="text-xs bg-red-100 dark:bg-red-950 text-red-500 rounded-full px-1.5 py-0.5 font-mono leading-none">
                  {favoriteWords.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("ayetler")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "ayetler"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <Bookmark
                className="h-4 w-4 text-primary shrink-0"
                fill={activeTab === "ayetler" ? "currentColor" : "none"}
              />
              <span>Ayetlerim</span>
              {verseCount > 0 && (
                <span className="text-xs bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-mono leading-none">
                  {verseCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "kelimeler" ? <KelimelerimTab /> : <AyetlerimTab />}
      </main>
    </div>
  );
}
