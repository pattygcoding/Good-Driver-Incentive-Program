
/* ---------------- FUNCTIONS TO HASH & VALIDATE PASSWORDS ------------- */

// Credits : https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
// REQUIRE CRYPTO LIBRARY

// Load environment variables
require('dotenv').config();

// FUNCTION TO CREATE PASSWORD HASH
// returns hashed password & corresponding salt value
function getHash(clear) {
  const CryptoJS = require("crypto-js");
  var key = process.env.ENCRYPTION_KEY || "default_encryption_key_change_me";

  var cipher = CryptoJS.AES.encrypt(clear, key);
  cipher = cipher.toString();
  console.log(cipher);
  return( cipher );

};

// FUNCTION TO VALIDATE PASSWORD
// userpass --> typed password given from user
// storedpassword --> hashed password in the database
function validatePassword(userpass, storedpassword) {
  const CryptoJS = require("crypto-js");
  var key = process.env.ENCRYPTION_KEY || "default_encryption_key_change_me";

   decryppass = CryptoJS.AES.decrypt(storedpassword, key);
   decryppass = decryppass.toString(CryptoJS.enc.Utf8);

  return userpass == decryppass;
};

module.exports = { getHash, validatePassword };
