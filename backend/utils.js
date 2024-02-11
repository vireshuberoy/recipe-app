const crypto = require("crypto");
// Function to generate a random salt
function generateSalt(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

// Function to hash a password with a given salt
function hashPassword(password, salt) {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const hashedPassword = hash.digest("hex");
  return {
    salt,
    hashedPassword,
  };
}

// Function to verify a password against its hash
function verifyPassword(password, salt, hashedPassword) {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const hashedInputPassword = hash.digest("hex");
  return hashedPassword === hashedInputPassword;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { generateSalt, hashPassword, verifyPassword, validateEmail }

// // Example usage:
// const password = "mySecretPassword";
// const salt = generateSalt(16); // Generate a 16-character salt
// const hashedPassword = hashPassword(password, salt);
// console.log(hashedPassword);

// console.log("Salt:", hashedPassword.salt);
// console.log("Hashed Password:", hashedPassword.passwordHash);

// const userInputPassword = "mySecretPassword";
// const isPasswordCorrect = verifyPassword(
//   userInputPassword,
//   salt,
//   hashedPassword.passwordHash,
// );

// console.log("Is Password Correct?", isPasswordCorrect);
