import type {
  DIBApiResponse,
  DIBChapter,
  Surah,
  Verse,
} from "@/types/quran";

const STATIC_QURAN_BASE = "/api/quran";
const ACIKKURAN_API = "https://api.acikkuran.com";

interface ChaptersResponse extends DIBApiResponse<DIBChapter[]> {}

interface RawAyah {
  id: number;
  number_in_surah: number;
  text: string;
  page: number;
  juz_id: number;
}

type AyahsBySurah = Record<string, RawAyah[]>;

const jsonCache = new Map<string, Promise<unknown>>();
const pageTranslationCache = new Map<number, Promise<Map<string, string>>>();
const surahTranslationCache = new Map<number, Promise<Map<number, string>>>();

function stripHtml(html: string): string {
  return html ? html.replace(/<[^>]*>/g, "") : "";
}

async function loadJson<T>(url: string): Promise<T> {
  if (!jsonCache.has(url)) {
    jsonCache.set(
      url,
      fetch(url).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}: ${response.status}`);
        }
        return response.json();
      })
    );
  }

  return jsonCache.get(url) as Promise<T>;
}

async function loadAyahsBySurah(): Promise<AyahsBySurah> {
  return loadJson<AyahsBySurah>(`${STATIC_QURAN_BASE}/ayahs-by-surah.json`);
}

async function getPageTranslations(pageNumber: number): Promise<Map<string, string>> {
  if (!pageTranslationCache.has(pageNumber)) {
    pageTranslationCache.set(
      pageNumber,
      fetch(`${ACIKKURAN_API}/page/${pageNumber}`)
        .then(async (response) => {
          if (!response.ok) {
            return new Map<string, string>();
          }

          const json = await response.json();
          const verses = json?.data;
          const map = new Map<string, string>();

          if (Array.isArray(verses)) {
            for (const verse of verses) {
              const surahId = verse.surah?.id || verse.surah_id;
              const verseNumber = verse.verse_number;
              if (surahId && verseNumber) {
                map.set(`${surahId}:${verseNumber}`, verse.translation?.text || "");
              }
            }
          }

          return map;
        })
        .catch(() => new Map<string, string>())
    );
  }

  return pageTranslationCache.get(pageNumber) as Promise<Map<string, string>>;
}

async function getSurahTranslations(surahId: number): Promise<Map<number, string>> {
  if (!surahTranslationCache.has(surahId)) {
    surahTranslationCache.set(
      surahId,
      fetch(`${ACIKKURAN_API}/surah/${surahId}`)
        .then(async (response) => {
          if (!response.ok) {
            return new Map<number, string>();
          }

          const json = await response.json();
          const verses = json?.data?.verses;
          const map = new Map<number, string>();

          if (Array.isArray(verses)) {
            for (const verse of verses) {
              if (verse?.verse_number) {
                map.set(verse.verse_number, verse.translation?.text || "");
              }
            }
          }

          return map;
        })
        .catch(() => new Map<number, string>())
    );
  }

  return surahTranslationCache.get(surahId) as Promise<Map<number, string>>;
}

function transformChapterToSurah(dibChapter: DIBChapter): Surah {
  return {
    id: dibChapter.SureId,
    names: {
      arabic: dibChapter.SureNameArabic,
      tr: dibChapter.SureNameTurkish,
      en: dibChapter.SureNameTurkish,
    },
    verses_count: dibChapter.AyetCount,
    revelation_place: dibChapter.InisOrder <= 86 ? "mecca" : "medina",
    description: {
      tr: stripHtml(dibChapter.MealInfo) || `${dibChapter.SureNameTurkish} suresi hakkında bilgi`,
      en: stripHtml(dibChapter.MealInfo) || `Information about ${dibChapter.SureNameTurkish} surah`,
    },
  };
}

function toVerse(rawAyah: RawAyah, surahId: number, translatedText: string): Verse {
  return {
    id: `${surahId}:${rawAyah.number_in_surah}`,
    surah_id: surahId,
    verse_number: rawAyah.number_in_surah,
    text_arabic: rawAyah.text,
    translations: {
      tr: translatedText,
      en: translatedText,
    },
    audio_url: `/audio/${surahId.toString().padStart(3, "0")}_${rawAyah.number_in_surah
      .toString()
      .padStart(3, "0")}.mp3`,
  };
}

export async function getPageData(pageNumber: number) {
  const [ayahsBySurah, translationMap] = await Promise.all([
    loadAyahsBySurah(),
    getPageTranslations(pageNumber),
  ]);

  const verses = Object.entries(ayahsBySurah)
    .flatMap(([surahId, ayahs]) =>
      ayahs
        .filter((ayah) => ayah.page === pageNumber)
        .map((ayah) =>
          toVerse(
            ayah,
            Number(surahId),
            translationMap.get(`${surahId}:${ayah.number_in_surah}`) || ""
          )
        )
    )
    .sort((a, b) => {
      if (a.surah_id !== b.surah_id) {
        return a.surah_id - b.surah_id;
      }
      return a.verse_number - b.verse_number;
    });

  return {
    page_number: pageNumber,
    verses,
  };
}

export async function getSurahData(surahId: number) {
  const [surahs, ayahsBySurah, translationMap] = await Promise.all([
    getSurahList(),
    loadAyahsBySurah(),
    getSurahTranslations(surahId),
  ]);

  const surah = surahs.find((item) => item.id === surahId);
  if (!surah) {
    throw new Error("Surah not found");
  }

  const verses = (ayahsBySurah[String(surahId)] || []).map((ayah) =>
    toVerse(ayah, surahId, translationMap.get(ayah.number_in_surah) || "")
  );

  return {
    surah,
    verses,
  };
}

export async function getSurahList(): Promise<Surah[]> {
  const response = await loadJson<ChaptersResponse>(`${STATIC_QURAN_BASE}/chapters.json`);
  return response.data.map(transformChapterToSurah);
}

export async function getVerseByReference(
  surahId: number,
  verseNumber: number
): Promise<Verse | null> {
  const surahData = await getSurahData(surahId);
  return surahData.verses.find((verse) => verse.verse_number === verseNumber) || null;
}

export async function searchVerses(query: string) {
  throw new Error(`searchVerses is not implemented for query: ${query}`);
}
