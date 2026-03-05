"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Play, Pause, Volume2, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { getSurahData } from "@/services/quran-api";
import { VerseComponent } from "./verse-component";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuranStore } from "@/stores/quran-store";
import { useAudioStore, RECITERS } from "@/stores/audio-store";
import { useLanguage } from "@/components/language-provider";

interface SurahReaderProps {
  surahId: number;
}

const FONT_MIN = 20;
const FONT_MAX = 48;
const FONT_STEP = 4;

export function SurahReader({ surahId }: SurahReaderProps) {
  const { currentTranslation, selectedReciter, setReciter } = useQuranStore();
  const { toggle, currentUrl, isPlaying, stop } = useAudioStore();
  const { t, language } = useLanguage();
  const [fontSize, setFontSize] = useState(28);

  const {
    data: surahData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["surah", surahId],
    queryFn: () => getSurahData(surahId),
    placeholderData: keepPreviousData,
  });

  const trAudioUrl = `https://audio.acikkuran.com/tr/${surahId}.mp3`;
  const isTrAudioPlaying = isPlaying && currentUrl === trAudioUrl;

  if (isLoading && !surahData) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
        <span className="ml-2">{t("quran.loading")}</span>
      </div>
    );
  }

  if (error || !surahData) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="py-8 text-center">
          <p className="text-destructive">{t("quran.surahNotFound")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-2 sm:space-y-6 sm:px-4 min-h-[calc(100vh-200px)]">
      <Card>
        <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl font-arabic leading-relaxed sm:text-3xl">
                {surahData.surah.names.arabic}
              </CardTitle>
              <p className="mt-2 text-lg text-muted-foreground sm:text-xl">
                {language === "tr"
                  ? surahData.surah.names.tr
                  : surahData.surah.names.en}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {surahData.surah.verses_count} {t("quran.verses")}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-accent/30 bg-card/50 hover:bg-accent/10 hover:text-accent"
            >
              <Link href="/quran/bookmarks">
                <BookmarkCheck className="h-4 w-4" />
                <span className="ml-2 hidden xs:inline">
                  {t("nav.bookmarks")}
                </span>
              </Link>
            </Button>
          </div>

          {/* Ses Kontrolleri */}
          <div className="mt-4 border-t border-border pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Okuyucu seçici */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground font-medium shrink-0">
                Okuyucu:
              </span>
              <div className="flex flex-wrap gap-1">
                {RECITERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setReciter(r.id)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      selectedReciter === r.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Türkçe meal sesi */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggle(trAudioUrl)}
              className="border-accent/30 hover:bg-accent/10 hover:text-accent shrink-0 w-44 justify-start gap-2"
            >
              <Volume2 className="h-4 w-4 shrink-0" />
              {isTrAudioPlaying ? <Pause className="h-3 w-3 shrink-0" /> : <Play className="h-3 w-3 shrink-0" />}
              <span className="text-xs">{isTrAudioPlaying ? "Türkçe Meal Durdur" : "Türkçe Meal Dinle"}</span>
            </Button>
          </div>

          {/* Yazı Boyutu Kontrolü */}
          <div className="mt-3 border-t border-border pt-3 flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium shrink-0">
              Yazı Boyutu:
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFontSize((s) => Math.max(FONT_MIN, s - FONT_STEP))}
                disabled={fontSize <= FONT_MIN}
                className="h-7 w-7 p-0"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <span className="text-sm text-muted-foreground w-8 text-center tabular-nums">
                {fontSize}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFontSize((s) => Math.min(FONT_MAX, s + FONT_STEP))}
                disabled={fontSize >= FONT_MAX}
                className="h-7 w-7 p-0"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </div>
            <span
              className="font-arabic text-muted-foreground leading-none"
              style={{ fontSize: `${fontSize}px` }}
            >
              بِسْمِ
            </span>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-3 sm:space-y-4">
        {surahData.verses.map((verse, index) => (
          <div
            key={verse.id}
            className="animate-in fade-in slide-in-from-top-4 duration-500"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <VerseComponent
              verse={verse}
              showTranslation={currentTranslation !== "none"}
              translationLanguage={currentTranslation}
              fontSize={fontSize}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
