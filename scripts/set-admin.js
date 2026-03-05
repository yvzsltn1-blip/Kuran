#!/usr/bin/env node
// Kullanım: node scripts/set-admin.js kullanici@email.com

const admin = require("firebase-admin");
const serviceAccount = require("../service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = process.argv[2];
if (!email) {
  console.error("Kullanım: node scripts/set-admin.js kullanici@email.com");
  process.exit(1);
}

admin
  .auth()
  .getUserByEmail(email)
  .then((user) => admin.auth().setCustomUserClaims(user.uid, { admin: true }))
  .then(() => {
    console.log(`Admin claim başarıyla set edildi: ${email}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Hata:", err.message);
    process.exit(1);
  });
