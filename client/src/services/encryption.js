import CryptoJS from "crypto-js";

// ⚠ Public key (NOT same as backend secret)
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET;

/* =========================
   Encrypt Function
========================= */

export const encryptData = (data) => {

  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();

  return ciphertext;
};


/* =========================
   Decrypt Function
========================= */

export const decryptData = (ciphertext) => {

  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);

  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

  if (!decryptedText) return null;

  return JSON.parse(decryptedText);
};
