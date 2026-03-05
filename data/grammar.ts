export interface GrammarLesson {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  level: "Başlangıç" | "Orta" | "İleri";
  duration: string;
  sections: GrammarSection[];
}

export interface GrammarSection {
  heading: string;
  content: string;
  examples?: { arabic: string; transliteration: string; turkish: string }[];
}

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: 1,
    title: "Arapça Alfabesi",
    subtitle: "28 harfi ve telaffuzlarını öğrenin",
    icon: "ا",
    level: "Başlangıç",
    duration: "15 dk",
    sections: [
      {
        heading: "Arapça Alfabesi Nedir?",
        content: "Arapça alfabesi 28 harften oluşur ve sağdan sola yazılır. Her harfin kelime başında, ortasında ve sonunda farklı yazım biçimi olabilir. Kur'an Arapçasında harfler genellikle harekeli (hareke) olarak yazılır.",
        examples: [
          { arabic: "أ", transliteration: "Elif (a)", turkish: "İlk harf" },
          { arabic: "ب", transliteration: "Be (b)", turkish: "İkinci harf" },
          { arabic: "ت", transliteration: "Te (t)", turkish: "Üçüncü harf" },
          { arabic: "ث", transliteration: "Se (s)", turkish: "Dördüncü harf" },
          { arabic: "ج", transliteration: "Cim (c/j)", turkish: "Beşinci harf" },
        ],
      },
      {
        heading: "Harekeler (Sesli Harfler)",
        content: "Kur'an'da harfler üzerine konulan işaretler (harekeler) sayesinde doğru okunuş sağlanır.",
        examples: [
          { arabic: "بَ", transliteration: "be (üstün/fetha)", turkish: "Kısa 'a' sesi" },
          { arabic: "بِ", transliteration: "bi (esre/kesra)", turkish: "Kısa 'i' sesi" },
          { arabic: "بُ", transliteration: "bu (ötre/damme)", turkish: "Kısa 'u' sesi" },
          { arabic: "بْ", transliteration: "b (sükun)", turkish: "Harekesiz harf" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "İsim ve Zamirler",
    subtitle: "Arapça isimleri ve zamirleri öğrenin",
    icon: "ه",
    level: "Başlangıç",
    duration: "20 dk",
    sections: [
      {
        heading: "Arapça'da Cinsiyet",
        content: "Arapça'da her ismin bir cinsiyeti vardır: Müzekker (erkek) veya Müennes (dişi). Müennes isimler genellikle 'ta merbuta' (ة) ile biter.",
        examples: [
          { arabic: "مُعَلِّم", transliteration: "Muallim", turkish: "Erkek öğretmen" },
          { arabic: "مُعَلِّمَة", transliteration: "Muallime", turkish: "Kadın öğretmen" },
          { arabic: "مُؤْمِن", transliteration: "Mü'min", turkish: "Erkek mümin" },
          { arabic: "مُؤْمِنَة", transliteration: "Mü'mine", turkish: "Kadın mümin" },
        ],
      },
      {
        heading: "Tekil, İkil ve Çoğul",
        content: "Arapça'da tekil (müfret), ikil (müsenna) ve çoğul (cemi) olmak üzere üç sayı kategorisi vardır.",
        examples: [
          { arabic: "مُؤْمِن", transliteration: "Mü'min", turkish: "Mümin (tekil)" },
          { arabic: "مُؤْمِنَانِ", transliteration: "Mü'minân", turkish: "İki mümin (ikil)" },
          { arabic: "مُؤْمِنُون", transliteration: "Mü'minûn", turkish: "Müminler (çoğul)" },
        ],
      },
      {
        heading: "Kur'an'dan Zamirler",
        content: "Kur'an'da en çok kullanılan zamirler:",
        examples: [
          { arabic: "هُوَ", transliteration: "Hüve", turkish: "O (erkek tekil)" },
          { arabic: "هِيَ", transliteration: "Hiye", turkish: "O (dişi tekil)" },
          { arabic: "هُمْ", transliteration: "Hüm", turkish: "Onlar (erkek çoğul)" },
          { arabic: "أَنْتَ", transliteration: "Ente", turkish: "Sen (erkek)" },
          { arabic: "نَحْنُ", transliteration: "Nahnu", turkish: "Biz" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Fiil Çekimi",
    subtitle: "Geçmiş ve geniş zaman fiil yapısı",
    icon: "ف",
    level: "Orta",
    duration: "25 dk",
    sections: [
      {
        heading: "Geçmiş Zaman (Mâzi)",
        content: "Arapça geçmiş zaman fiilleri genellikle 3 harfli bir kökten türer. En basit kalıp: فَعَلَ (fa'ale) kalıbıdır.",
        examples: [
          { arabic: "كَتَبَ", transliteration: "Ketebe", turkish: "Yazdı" },
          { arabic: "قَرَأَ", transliteration: "Kara'e", turkish: "Okudu" },
          { arabic: "ذَهَبَ", transliteration: "Zehebe", turkish: "Gitti" },
          { arabic: "خَلَقَ", transliteration: "Haleka", turkish: "Yarattı" },
        ],
      },
      {
        heading: "Şimdiki/Gelecek Zaman (Muzâri)",
        content: "Muzâri fiiller geniş ve gelecek zamanı ifade eder. Fiilin başına önek (ي/ت/ن/أ) eklenir.",
        examples: [
          { arabic: "يَكْتُبُ", transliteration: "Yektubu", turkish: "Yazar / Yazıyor" },
          { arabic: "يَقْرَأُ", transliteration: "Yakra'u", turkish: "Okur / Okuyor" },
          { arabic: "نَعْبُدُ", transliteration: "Na'budu", turkish: "İbadet ederiz" },
          { arabic: "نَسْتَعِينُ", transliteration: "Nesta'înu", turkish: "Yardım dileriz" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Cümle Yapısı",
    subtitle: "Arapça cümle kuruluşunu anlayın",
    icon: "ج",
    level: "Orta",
    duration: "20 dk",
    sections: [
      {
        heading: "İsim Cümlesi (Cümle-i İsmiye)",
        content: "İsim cümlesi, Mübteda (özne) ve Haber (yüklem) olmak üzere iki ana unsurdan oluşur. Türkçe'deki 'A, B'dir' yapısına benzer.",
        examples: [
          { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Ekber", turkish: "Allah en büyüktür" },
          { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "El-Hamdu lillâh", turkish: "Hamd Allah'a mahsustur" },
          { arabic: "هُوَ الْحَيُّ", transliteration: "Hüvel Hayy", turkish: "O, Diri olandır" },
        ],
      },
      {
        heading: "Fiil Cümlesi (Cümle-i Fiiliye)",
        content: "Fiil cümlesi fiille başlar. Sıralama: Fiil + Fail (özne) + Mef'ul (nesne) şeklindedir.",
        examples: [
          { arabic: "خَلَقَ اللَّهُ السَّمَاوَاتِ", transliteration: "Halakallâhu's-semâvât", turkish: "Allah gökleri yarattı" },
          { arabic: "أَنْزَلَ اللَّهُ الْقُرْآنَ", transliteration: "Enzellallâhul-Kur'ân", turkish: "Allah Kur'an'ı indirdi" },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Kur'an'da En Sık Kelimeler",
    subtitle: "En çok tekrarlanan 20 kelime",
    icon: "ق",
    level: "Başlangıç",
    duration: "15 dk",
    sections: [
      {
        heading: "Neden Sık Geçen Kelimeleri Öğrenelim?",
        content: "Kur'an'da en sık geçen 300 kelimeyi bilmek, metnin yaklaşık %70'ini anlamanızı sağlar. Bu sayfada en kritik kelimeleri öğreneceksiniz.",
        examples: [
          { arabic: "وَ", transliteration: "Ve", turkish: "Ve (31,000+ kez)" },
          { arabic: "لَا", transliteration: "Lâ", turkish: "Yok/Hayır (5,100+ kez)" },
          { arabic: "مِنْ", transliteration: "Min", turkish: "-den/-dan (3,200+ kez)" },
          { arabic: "اللَّه", transliteration: "Allah", turkish: "Allah (2,699 kez)" },
          { arabic: "فِي", transliteration: "Fî", turkish: "-de/-da (1,700+ kez)" },
          { arabic: "عَلَى", transliteration: "Alâ", turkish: "Üzerinde (1,370+ kez)" },
          { arabic: "كَانَ", transliteration: "Kâne", turkish: "Oldu/İdi (1,358 kez)" },
          { arabic: "قَالَ", transliteration: "Kâle", turkish: "Dedi (1,722 kez)" },
        ],
      },
    ],
  },
];
