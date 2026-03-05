/**
 * quran.sql'den surah ve ayah verilerini JSON'a çeviren script
 * Çalıştırma: node scripts/parse-quran-sql.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SQL_PATH = 'C:\\Users\\YAVUZ\\Downloads\\islam\\quran-database\\quran.sql';
const OUTPUT_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const surahs = [];
const ayahs = {}; // surah_id -> [{number_in_surah, text, page, juz_id}]

// Tırnak içindeki string değerleri çıkarmak için gelişmiş parser
// SQL row formatı: (val1, 'str val', val3, ...)
function parseValues(row) {
  // Başındaki/sonundaki parantezleri kaldır
  let s = row.trim();
  if (s.startsWith('(')) s = s.slice(1);
  if (s.endsWith(');') || s.endsWith('),')) s = s.slice(0, -2);
  else if (s.endsWith(')')) s = s.slice(0, -1);

  const parts = [];
  let current = '';
  let inStr = false;
  let i = 0;

  while (i < s.length) {
    const c = s[i];
    if (!inStr && c === "'") {
      inStr = true;
      i++;
    } else if (inStr && c === '\\') {
      // Escaped character like \' or \\
      current += s[i+1] || '';
      i += 2;
    } else if (inStr && c === "'" && s[i+1] === "'") {
      current += "'";
      i += 2;
    } else if (inStr && c === "'") {
      inStr = false;
      i++;
    } else if (!inStr && c === ',') {
      parts.push(current.trim());
      current = '';
      i++;
    } else {
      current += c;
      i++;
    }
  }
  if (current.trim() !== '' || parts.length > 0) parts.push(current.trim());

  return parts;
}

const rl = readline.createInterface({
  input: fs.createReadStream(SQL_PATH, { encoding: 'utf8' }),
  crlfDelay: Infinity,
});

let lineCount = 0;
let mode = null; // 'surahs' | 'ayahs' | null

rl.on('line', (line) => {
  lineCount++;
  if (lineCount % 100000 === 0) {
    process.stdout.write(`\r${lineCount} satır işlendi, ${surahs.length} sure, ${Object.values(ayahs).reduce((a,b)=>a+b.length,0)} ayet...`);
  }

  const trimmed = line.trim();

  // INSERT INTO `surahs` VALUE satırı
  if (trimmed.startsWith('INSERT INTO `surahs`')) {
    mode = 'surahs';
    return;
  }

  // INSERT INTO `ayahs` VALUE satırı
  if (trimmed.startsWith('INSERT INTO `ayahs`')) {
    mode = 'ayahs';
    return;
  }

  // Farklı bir INSERT veya CREATE TABLE
  if (trimmed.startsWith('INSERT INTO') || trimmed.startsWith('CREATE TABLE') || trimmed.startsWith('ALTER TABLE')) {
    mode = null;
    return;
  }

  if (mode === null) return;

  // Her satır bir row: (val1, val2, ...) veya son satır ; ile bitiyor
  if (!trimmed.startsWith('(')) return;

  const parts = parseValues(trimmed);

  if (mode === 'surahs' && parts.length >= 6) {
    // id, number, name_ar, name_en, name_en_translation, type, ...
    const id = parseInt(parts[0]);
    if (!isNaN(id) && id >= 1 && id <= 114) {
      surahs.push({
        id,
        number: parseInt(parts[1]) || id,
        name_ar: parts[2] || '',
        name_en: parts[3] || '',
        name_en_translation: parts[4] || '',
        type: parts[5] || 'Meccan',
      });
    }
  }

  if (mode === 'ayahs' && parts.length >= 8) {
    // id, number, text, number_in_surah, page, surah_id, hizb_id, juz_id, sajda, ...
    const id = parseInt(parts[0]);
    const text = parts[2];
    const number_in_surah = parseInt(parts[3]);
    const page = parseInt(parts[4]);
    const surah_id = parseInt(parts[5]);
    const juz_id = parseInt(parts[7]);

    if (!isNaN(surah_id) && surah_id >= 1 && surah_id <= 114 && text) {
      if (!ayahs[surah_id]) ayahs[surah_id] = [];
      ayahs[surah_id].push({ id, number_in_surah, text, page, juz_id });
    }
  }
});

rl.on('close', () => {
  const totalAyahs = Object.values(ayahs).reduce((a, b) => a + b.length, 0);
  console.log(`\n\nTamamlandı: ${surahs.length} sure, ${totalAyahs} ayet`);

  // Sıralama
  surahs.sort((a, b) => a.id - b.id);
  for (const key of Object.keys(ayahs)) {
    ayahs[key].sort((a, b) => a.number_in_surah - b.number_in_surah);
  }

  // Eksik sure kontrolü
  const surahIds = new Set(surahs.map(s => s.id));
  const missing = [];
  for (let i = 1; i <= 114; i++) {
    if (!surahIds.has(i)) missing.push(i);
  }
  if (missing.length > 0) {
    console.log('Eksik sureler:', missing);
  }

  // JSON'a yaz
  const surahsPath = path.join(OUTPUT_DIR, 'surahs-data.json');
  const ayahsPath = path.join(OUTPUT_DIR, 'ayahs-data.json');

  fs.writeFileSync(surahsPath, JSON.stringify(surahs, null, 2), 'utf8');
  console.log(`Sureler yazıldı: ${surahsPath}`);

  fs.writeFileSync(ayahsPath, JSON.stringify(ayahs, null, 2), 'utf8');
  console.log(`Ayetler yazıldı: ${ayahsPath}`);

  // Kontrol
  console.log('\n1. Sure:', surahs[0]);
  console.log('Fatiha ayetleri:', ayahs[1] ? ayahs[1].length : 'YOK');
  console.log('Bakara ayetleri:', ayahs[2] ? ayahs[2].length : 'YOK');
  console.log('İhlas ayetleri:', ayahs[112] ? ayahs[112].length : 'YOK');
});
