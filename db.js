const admin = require("firebase-admin");
const config = require("./config");
const serviceAccount = require("./serviceAccountKey.json");

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.firebaseConfig.storageBucket,
});

module.exports = db;
