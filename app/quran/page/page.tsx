"use client";

import { Header } from "@/components/layout/header";
import { QuranNavigation } from "@/components/quran/quran-navigation";
import { QuranReader } from "@/components/quran/quran-reader";
import { useSearchParams } from "next/navigation";

function getPageNumber(value: string | null): number {
  const page = Number.parseInt(value || "1", 10);
  if (Number.isNaN(page) || page < 1 || page > 604) {
    return 1;
  }
  return page;
}

export default function QuranPageRoute() {
  const searchParams = useSearchParams();
  const pageNumber = getPageNumber(searchParams.get("number"));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <QuranNavigation currentPage={pageNumber} />
        <QuranReader pageNumber={pageNumber} />
      </div>
    </div>
  );
}
