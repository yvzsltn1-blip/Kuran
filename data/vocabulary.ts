export interface VocabWord {
  id: number;
  arabic: string;
  transliteration: string;
  turkish: string;
  category: string;
  example?: string;
  exampleTranslation?: string;
  frequency: number; // Kur'an'da kaç kez geçiyor
}

export const VOCABULARY: VocabWord[] = [
  // Temel Kelimeler
  { id: 1, arabic: "اللَّهُ", transliteration: "Allah", turkish: "Allah", category: "Temel", example: "بِسْمِ اللَّهِ", exampleTranslation: "Allah'ın adıyla", frequency: 2699 },
  { id: 2, arabic: "رَبّ", transliteration: "Rabb", turkish: "Rab (Efendi/Yaratıcı)", category: "Temel", example: "رَبِّ الْعَالَمِينَ", exampleTranslation: "Âlemlerin Rabbi", frequency: 980 },
  { id: 3, arabic: "رَحْمَن", transliteration: "Rahmân", turkish: "Rahman (Çok merhametli)", category: "Temel", frequency: 57 },
  { id: 4, arabic: "رَحِيم", transliteration: "Rahîm", turkish: "Rahim (Daima merhametli)", category: "Temel", frequency: 95 },
  { id: 5, arabic: "مَلِك", transliteration: "Melik", turkish: "Melik (Hükümdar/Kral)", category: "Temel", frequency: 5 },
  { id: 6, arabic: "دِين", transliteration: "Dîn", turkish: "Din / Hesap / Ceza günü", category: "Temel", frequency: 92 },
  { id: 7, arabic: "نَعْبُد", transliteration: "Na'budu", turkish: "İbadet ederiz", category: "Fiiller", frequency: 1 },
  { id: 8, arabic: "نَسْتَعِين", transliteration: "Nesta'în", turkish: "Yardım dileriz", category: "Fiiller", frequency: 1 },
  { id: 9, arabic: "صِرَاط", transliteration: "Sırât", turkish: "Yol / Doğru yol", category: "Temel", frequency: 45 },
  { id: 10, arabic: "مُسْتَقِيم", transliteration: "Müstakîm", turkish: "Doğru / Düz", category: "Sıfatlar", frequency: 34 },

  // Zamirler
  { id: 11, arabic: "أَنَا", transliteration: "Ene", turkish: "Ben", category: "Zamirler", frequency: 62 },
  { id: 12, arabic: "أَنْتَ", transliteration: "Ente", turkish: "Sen (erkek)", category: "Zamirler", frequency: 44 },
  { id: 13, arabic: "هُوَ", transliteration: "Hüve", turkish: "O (erkek)", category: "Zamirler", frequency: 656 },
  { id: 14, arabic: "هِيَ", transliteration: "Hiye", turkish: "O (dişi)", category: "Zamirler", frequency: 34 },
  { id: 15, arabic: "نَحْنُ", transliteration: "Nahnu", turkish: "Biz", category: "Zamirler", frequency: 133 },
  { id: 16, arabic: "أَنْتُمْ", transliteration: "Entüm", turkish: "Siz", category: "Zamirler", frequency: 117 },
  { id: 17, arabic: "هُمْ", transliteration: "Hüm", turkish: "Onlar", category: "Zamirler", frequency: 562 },

  // Edatlar
  { id: 18, arabic: "فِي", transliteration: "Fî", turkish: "İçinde / -de/-da", category: "Edatlar", frequency: 1722 },
  { id: 19, arabic: "مِنْ", transliteration: "Min", turkish: "-den/-dan / içinden", category: "Edatlar", frequency: 3226 },
  { id: 20, arabic: "إِلَى", transliteration: "İlâ", turkish: "-e/-a doğru / kadar", category: "Edatlar", frequency: 742 },
  { id: 21, arabic: "عَلَى", transliteration: "Alâ", turkish: "Üzerinde / -e göre", category: "Edatlar", frequency: 1372 },
  { id: 22, arabic: "عَن", transliteration: "An", turkish: "Hakkında / -den", category: "Edatlar", frequency: 544 },
  { id: 23, arabic: "بِ", transliteration: "Bi", turkish: "İle / vasıtasıyla", category: "Edatlar", frequency: 10000 },
  { id: 24, arabic: "لِ", transliteration: "Li", turkish: "İçin / -e/-a ait", category: "Edatlar", frequency: 10000 },

  // Bağlaçlar
  { id: 25, arabic: "وَ", transliteration: "Ve", turkish: "Ve", category: "Bağlaçlar", frequency: 31175 },
  { id: 26, arabic: "أَوْ", transliteration: "Ev", turkish: "Veya / Ya da", category: "Bağlaçlar", frequency: 289 },
  { id: 27, arabic: "لَكِنْ", transliteration: "Lâkin", turkish: "Fakat / Ama", category: "Bağlaçlar", frequency: 23 },
  { id: 28, arabic: "إِنَّ", transliteration: "İnne", turkish: "Şüphesiz / Gerçekten", category: "Bağlaçlar", frequency: 533 },
  { id: 29, arabic: "لَا", transliteration: "Lâ", turkish: "Yok / Değil / Hayır", category: "Bağlaçlar", frequency: 5185 },

  // Yaratılış ve Kâinat
  { id: 30, arabic: "سَمَاء", transliteration: "Semâ", turkish: "Gökyüzü", category: "Kâinat", frequency: 320 },
  { id: 31, arabic: "أَرْض", transliteration: "Arz", turkish: "Yeryüzü / Toprak", category: "Kâinat", frequency: 461 },
  { id: 32, arabic: "نُور", transliteration: "Nûr", turkish: "Işık / Nur", category: "Kâinat", frequency: 49 },
  { id: 33, arabic: "مَاء", transliteration: "Mâ'", turkish: "Su", category: "Kâinat", frequency: 63 },
  { id: 34, arabic: "نَار", transliteration: "Nâr", turkish: "Ateş / Cehennem", category: "Kâinat", frequency: 145 },
  { id: 35, arabic: "جَنَّة", transliteration: "Cenne", turkish: "Cennet / Bahçe", category: "Kâinat", frequency: 147 },

  // İnsan
  { id: 36, arabic: "نَاس", transliteration: "Nâs", turkish: "İnsanlar", category: "İnsan", frequency: 241 },
  { id: 37, arabic: "إِنْسَان", transliteration: "İnsân", turkish: "İnsan", category: "İnsan", frequency: 65 },
  { id: 38, arabic: "قَلْب", transliteration: "Kalb", turkish: "Kalp / Yürek", category: "İnsan", frequency: 132 },
  { id: 39, arabic: "عَقْل", transliteration: "Akl", turkish: "Akıl", category: "İnsan", frequency: 0 },
  { id: 40, arabic: "رُوح", transliteration: "Rûh", turkish: "Ruh / Can", category: "İnsan", frequency: 24 },

  // Temel Fiiller
  { id: 41, arabic: "قَالَ", transliteration: "Kâle", turkish: "Dedi / Söyledi", category: "Fiiller", frequency: 1722 },
  { id: 42, arabic: "آمَنَ", transliteration: "Âmene", turkish: "İman etti / İnandı", category: "Fiiller", frequency: 537 },
  { id: 43, arabic: "عَمِلَ", transliteration: "Amile", turkish: "Yaptı / Çalıştı", category: "Fiiller", frequency: 360 },
  { id: 44, arabic: "جَاءَ", transliteration: "Câ'e", turkish: "Geldi", category: "Fiiller", frequency: 278 },
  { id: 45, arabic: "ذَهَبَ", transliteration: "Zehebe", turkish: "Gitti", category: "Fiiller", frequency: 8 },
  { id: 46, arabic: "عَلِمَ", transliteration: "Alime", turkish: "Bildi", category: "Fiiller", frequency: 382 },
  { id: 47, arabic: "خَلَقَ", transliteration: "Haleka", turkish: "Yarattı", category: "Fiiller", frequency: 259 },
  { id: 48, arabic: "أَرْسَلَ", transliteration: "Ersele", turkish: "Gönderdi", category: "Fiiller", frequency: 160 },
  { id: 49, arabic: "كَانَ", transliteration: "Kâne", turkish: "Oldu / İdi", category: "Fiiller", frequency: 1358 },
  { id: 50, arabic: "رَأَى", transliteration: "Ra'â", turkish: "Gördü", category: "Fiiller", frequency: 148 },

  // Sıfatlar
  { id: 51, arabic: "كَبِير", transliteration: "Kebîr", turkish: "Büyük", category: "Sıfatlar", frequency: 163 },
  { id: 52, arabic: "صَغِير", transliteration: "Sagîr", turkish: "Küçük", category: "Sıfatlar", frequency: 9 },
  { id: 53, arabic: "عَظِيم", transliteration: "Azîm", turkish: "Büyük / Yüce", category: "Sıfatlar", frequency: 105 },
  { id: 54, arabic: "حَكِيم", transliteration: "Hakîm", turkish: "Hâkim / Hikmet sahibi", category: "Sıfatlar", frequency: 97 },
  { id: 55, arabic: "عَلِيم", transliteration: "Alîm", turkish: "Her şeyi bilen", category: "Sıfatlar", frequency: 157 },
  { id: 56, arabic: "قَدِير", transliteration: "Kadîr", turkish: "Her şeye gücü yeten", category: "Sıfatlar", frequency: 45 },
  { id: 57, arabic: "حَيّ", transliteration: "Hayy", turkish: "Diri / Canlı", category: "Sıfatlar", frequency: 19 },
  { id: 58, arabic: "حَق", transliteration: "Hak", turkish: "Gerçek / Hak", category: "Sıfatlar", frequency: 287 },

  // İbadet ve Din
  { id: 59, arabic: "صَلَاة", transliteration: "Salât", turkish: "Namaz / Dua", category: "İbadet", frequency: 99 },
  { id: 60, arabic: "زَكَاة", transliteration: "Zekât", turkish: "Zekât / Temizlik", category: "İbadet", frequency: 30 },
  { id: 61, arabic: "صَوْم", transliteration: "Savm", turkish: "Oruç", category: "İbadet", frequency: 14 },
  { id: 62, arabic: "حَجّ", transliteration: "Hacc", turkish: "Hac", category: "İbadet", frequency: 10 },
  { id: 63, arabic: "تَوْبَة", transliteration: "Tevbe", turkish: "Tövbe / Dönüş", category: "İbadet", frequency: 17 },
  { id: 64, arabic: "دُعَاء", transliteration: "Duâ", turkish: "Dua / Çağırma", category: "İbadet", frequency: 20 },
];

export const CATEGORIES = [...new Set(VOCABULARY.map((w) => w.category))];
