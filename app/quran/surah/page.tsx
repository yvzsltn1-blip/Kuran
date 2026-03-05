"use client";

import { Header } from "@/components/layout/header";
import { SurahNavigation } from "@/components/quran/surah-navigation";
import { SurahReader } from "@/components/quran/surah-reader";
import { useSearchParams } from "next/navigation";

function getSurahId(value: string | null): number {
  const surahId = Number.parseInt(value || "1", 10);
  if (Number.isNaN(surahId) || surahId < 1 || surahId > 114) {
    return 1;
  }
  return surahId;
}

export default function SurahRoute() {
  const searchParams = useSearchParams();
  const surahId = getSurahId(searchParams.get("id"));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-2 py-6 sm:px-4 sm:py-8">
        <SurahNavigation currentSurah={surahId} />
        <SurahReader surahId={surahId} />
      </div>
    </div>
  );
}
