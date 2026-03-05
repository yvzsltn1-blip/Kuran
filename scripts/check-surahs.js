const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: fs.createReadStream('C:\\Users\\YAVUZ\\Downloads\\islam\\quran-database\\quran.sql', {encoding:'utf8'}) });
let inSurahs = false;
const missing = [6, 7, 13, 26, 62, 70, 79, 87, 101, 107];

rl.on('line', (line) => {
  if (line.includes('INSERT INTO `surahs`')) { inSurahs = true; return; }
  if (inSurahs && (line.startsWith('INSERT') || line.startsWith('CREATE'))) { inSurahs = false; return; }
  if (!inSurahs) return;
  const trimmed = line.trim();
  for (const id of missing) {
    if (trimmed.startsWith('(' + id + ',')) {
      console.log('ID ' + id + ':', trimmed.substring(0, 150));
    }
  }
});
rl.on('close', () => console.log('done'));
