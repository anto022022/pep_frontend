import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

// Use environment variable
const SECRET_KEY = `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` || "default_key";

export const encryptBreadcrumbs = (data: any): string => {
  try {
    // const jsonString = JSON.stringify(data);
    // const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    const jsonString = JSON.stringify(data);
    const encrypted = AES.encrypt(jsonString, SECRET_KEY).toString();
    return encodeURIComponent(encrypted); // Safe for URLs
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};

export const decryptBreadcrumbs = (encrypted: string): any | null => {
  try {
    const decoded = decodeURIComponent(encrypted);
    const bytes = AES.decrypt(decoded, SECRET_KEY);
    const decrypted = bytes.toString(Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
};
