import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const publicApiDir = path.join(rootDir, "public", "api", "quran");

async function readJson(relativePath) {
  const filePath = path.join(dataDir, relativePath);
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content);
}

async function main() {
  const [surahsData, ayahsData, surahTr] = await Promise.all([
    readJson("surahs-data.json"),
    readJson("ayahs-data.json"),
    readJson("surah-tr.json"),
  ]);

  await rm(publicApiDir, { recursive: true, force: true });
  await mkdir(publicApiDir, { recursive: true });

  const chapters = surahsData.map((surah) => {
    const surahAyahs = ayahsData[String(surah.id)] || [];
    const tr = surahTr[String(surah.id)];

    return {
      SureId: surah.id,
      SureNameTurkish: tr?.name || surah.name_en,
      SureNameArabic: tr?.name_original || surah.name_ar,
      BesmeleVisible: surah.id !== 1 && surah.id !== 9,
      InisOrder: surah.type === "Meccan" ? 1 : 87,
      AyetCount: surahAyahs.length,
      Cuz: surahAyahs[0]?.juz_id || 1,
      FirstPage: surahAyahs[0]?.page || 0,
      MealInfo: `${tr?.name || surah.name_en} - ${surah.name_en_translation}`,
      HeaderOnBackPage: false,
    };
  });

  await Promise.all([
    writeFile(
      path.join(publicApiDir, "chapters.json"),
      JSON.stringify({
        data: chapters,
        meta: { requested_language: "tr" },
      })
    ),
    writeFile(
      path.join(publicApiDir, "ayahs-by-surah.json"),
      JSON.stringify(ayahsData)
    ),
  ]);
}

main().catch((error) => {
  console.error("Failed to generate static Quran data:", error);
  process.exitCode = 1;
});
